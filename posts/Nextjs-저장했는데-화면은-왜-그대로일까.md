---
title: "Next.js에서 저장했는데 화면은 왜 그대로일까"
date: "2026-10-15"
category: "Dev"
tags: ["Next.js", "Cache", "Frontend"]
---

게시글 수정 API는 성공했고 DB도 바뀌었는데, 목록으로 돌아오면 이전 제목이 그대로 보였다. 새로고침을 몇 번 하거나 잠시 기다리면 그제야 바뀌었다.

처음에는 저장이 늦게 반영되는 문제라고 생각했다. 하지만 서버 데이터는 이미 바뀌어 있었다. 문제는 **데이터를 변경하는 것과 Next.js가 들고 있는 캐시를 최신 상태로 만드는 것이 별개의 작업**이라는 점이었다.

## 문제 상황

게시글 목록과 상세 페이지가 있는 프로젝트를 생각해보자.

```text
/posts          게시글 목록
/posts/[id]     게시글 상세
/posts/[id]/edit 게시글 수정
```

수정 화면에서 Server Action으로 DB를 업데이트했다.

```ts
// app/posts/actions.ts
"use server";

export async function updatePost(id: string, formData: FormData) {
  const title = String(formData.get("title"));

  await db.post.update({
    where: { id },
    data: { title },
  });

  return { success: true };
}
```

이 코드는 DB만 바꾼다. 목록 페이지가 이전에 만들어둔 결과를 캐시하고 있다면, 데이터베이스가 바뀌었다는 사실을 Next.js가 자동으로 알지는 못한다.

```text
DB 데이터          : 새 제목
Next.js 캐시       : 이전 제목
브라우저에 보이는 값 : 이전 제목
```

→ mutation이 성공했다는 것과 다음 화면이 최신이라는 것은 같은 말이 아니다.

---

## 먼저 어떤 값을 캐시했는지 확인한다

Next.js 16의 Cache Components를 사용한다면 `cacheComponents`를 켜고, 캐시할 함수나 컴포넌트에 `use cache`를 명시한다.

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

```ts
// app/posts/data.ts
import { cacheTag } from "next/cache";

export async function getPosts() {
  "use cache";
  cacheTag("posts");

  return db.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}
```

`cacheTag("posts")`는 이 결과에 이름표를 붙이는 것에 가깝다. 나중에 글을 추가하거나 수정했을 때 `posts`라는 이름표가 붙은 캐시를 골라서 무효화할 수 있다.

태그 없이 캐시부터 적용하면 읽기는 빨라질 수 있다. 대신 데이터가 바뀌었을 때 무엇을 갱신해야 하는지 찾기 어려워진다.

> 캐시를 넣을 때는 만료시키는 방법도 같이 설계해야 한다.

이 글의 예시는 Next.js 서버가 실행되는 프로젝트 기준이다. 현재 이 블로그처럼 `output: "export"`로 정적 내보내기만 하는 환경에서는 Cache Components를 사용할 수 없다.

---

## 1. router.refresh는 서버 캐시를 지우지 않는다

수정 후 화면을 갱신하려고 가장 먼저 떠올린 코드는 `router.refresh()`였다.

```tsx
"use client";

import { useRouter } from "next/navigation";

export function EditPostButton() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await updatePost("post-1", formData);
    router.refresh();
  };

  // form UI 생략
}
```

`router.refresh()`는 현재 경로에 대해 서버에 새 RSC 요청을 보내고 Server Component를 다시 렌더링한다. 클라이언트의 `useState`나 스크롤 위치는 유지하면서 새 결과를 합친다.

문제는 서버에서 다시 읽은 값이 여전히 캐시된 값일 수 있다는 점이다.

```text
router.refresh()
  → 서버에 다시 요청
  → getPosts() 다시 사용
  → 아직 유효한 "posts" 캐시 반환
  → 화면도 이전 값
```

Next.js [useRouter 공식 문서](https://nextjs.org/docs/app/api-reference/functions/use-router)도 `router.refresh()`가 서버 측 캐시를 무효화하지 않는다고 설명한다.

## 여기서 중요한 포인트 - refresh

- `router.refresh()`는 현재 라우트의 화면을 다시 요청한다
- 이미 캐시된 서버 데이터 자체를 만료시키지는 않는다
- 최신 화면이 필요하다면 먼저 서버 캐시의 상태를 확인해야 한다

---

## 2. 특정 화면을 다시 만들 때는 revalidatePath

`revalidatePath`는 특정 페이지나 레이아웃 경로의 캐시를 무효화한다.

```ts
// app/posts/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function updatePost(id: string, formData: FormData) {
  const title = String(formData.get("title"));

  await db.post.update({
    where: { id },
    data: { title },
  });

  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
}
```

목록과 상세 경로가 명확하고 그 화면만 다시 만들면 되는 경우에는 이해하기 쉽다.

다만 같은 게시글 데이터가 홈의 최근 글, 관리자 대시보드, 작성자 페이지에도 쓰인다면 경로를 계속 추가해야 한다.

```ts
revalidatePath("/posts");
revalidatePath(`/posts/${id}`);
revalidatePath("/dashboard");
revalidatePath(`/users/${authorId}`);
```

이 시점부터는 데이터 하나를 수정할 때 그 데이터를 사용하는 모든 URL을 알아야 한다. 화면 구조가 바뀔 때 action도 같이 고쳐야 한다.

→ `revalidatePath`는 **어느 화면을 다시 만들 것인가**를 기준으로 생각하는 API다.

---

## 3. 같은 데이터를 여러 화면에서 쓴다면 tag로 묶는다

게시글 데이터가 여러 경로에서 사용된다면 경로보다 데이터 이름으로 무효화하는 편이 자연스럽다.

```ts
// app/posts/data.ts
import { cacheTag } from "next/cache";

export async function getPost(id: string) {
  "use cache";
  cacheTag("posts", `post-${id}`);

  return db.post.findUnique({
    where: { id },
  });
}
```

하나의 캐시 항목에 목록 단위 태그와 개별 게시글 태그를 같이 붙였다.

```text
posts        → 게시글이 사용되는 전체 영역
post-123     → 123번 게시글 하나
```

이제 수정 범위에 맞춰 태그를 선택할 수 있다.

```ts
"use server";

import { updateTag } from "next/cache";

export async function updatePost(id: string, formData: FormData) {
  const title = String(formData.get("title"));

  await db.post.update({
    where: { id },
    data: { title },
  });

  updateTag(`post-${id}`);
  updateTag("posts");
}
```

이렇게 하면 URL이 아니라 데이터 기준으로 연결된다. 나중에 게시글을 보여주는 화면이 하나 더 생겨도 같은 태그를 사용하면 된다.

## 여기서 중요한 포인트 - tag

- path는 화면의 위치를 기준으로 무효화한다
- tag는 데이터의 관계를 기준으로 무효화한다
- 같은 데이터가 여러 페이지에 나타날수록 tag가 관리하기 쉽다

---

## updateTag와 revalidateTag는 결과가 다르다

이름이 비슷해서 처음에는 둘 중 아무거나 써도 된다고 생각했다. Next.js 16에서는 목적이 분명히 다르다.

| 구분 | `updateTag` | `revalidateTag(tag, "max")` |
| --- | --- | --- |
| 호출 위치 | Server Action | Server Action, Route Handler |
| 기존 데이터 | 즉시 만료 | stale 상태로 변경 |
| 다음 읽기 | 새 데이터를 기다림 | 이전 값을 먼저 주고 백그라운드 갱신 |
| 어울리는 상황 | 사용자가 방금 수정한 값 | 약간 늦게 바뀌어도 되는 목록 |

사용자가 프로필 이름을 수정한 직후에는 바로 새 이름을 보는 것이 자연스럽다. 이런 동작을 read-your-writes라고 한다.

```ts
import { updateTag } from "next/cache";

export async function updateProfile(userId: string, formData: FormData) {
  "use server";

  await db.user.update({
    where: { id: userId },
    data: { name: String(formData.get("name")) },
  });

  updateTag(`user-${userId}`);
}
```

반면 상품 목록이나 공개 게시글처럼 약간 이전 데이터가 잠시 보여도 괜찮다면 stale-while-revalidate 방식이 어울릴 수 있다.

```ts
"use server";

import { revalidateTag } from "next/cache";

export async function handleCmsWebhook() {
  revalidateTag("posts", "max");
}
```

`revalidateTag("posts", "max")`는 다음 방문에서 이전 값을 빠르게 보여주고 백그라운드에서 새 값을 가져온다. 사용자는 기다리지 않지만, 아주 짧은 시간 동안 이전 내용을 볼 수 있다.

Next.js의 [버전 16 업그레이드 문서](https://nextjs.org/docs/app/guides/upgrading/version-16)는 사용자 변경 직후에는 `updateTag`, 약간의 지연이 허용되는 콘텐츠에는 `revalidateTag`를 사용하는 방향을 설명한다.

→ 둘의 차이는 문법이 아니라 **사용자에게 이전 값을 보여줘도 되는가**에 있다.

---

## 어떤 API를 선택할까

내가 정리한 기준은 이렇다.

| 상황 | 먼저 볼 API | 이유 |
| --- | --- | --- |
| 현재 화면만 다시 요청 | `router.refresh()` | 클라이언트 상태를 유지하며 RSC를 다시 받음 |
| 특정 페이지 결과를 무효화 | `revalidatePath()` | 영향받는 URL이 명확함 |
| 수정한 값을 즉시 확인 | `updateTag()` | 이전 캐시를 즉시 만료 |
| 이전 값을 잠깐 보여줘도 됨 | `revalidateTag(tag, "max")` | stale-while-revalidate 가능 |

여기서 `router.refresh()`와 나머지는 같은 층의 API가 아니다.

```text
router.refresh   : 화면을 다시 요청한다
revalidatePath   : 특정 경로의 서버 캐시를 무효화한다
updateTag        : 특정 데이터 캐시를 즉시 만료시킨다
revalidateTag    : 특정 데이터 캐시를 stale 상태로 만든다
```

캐시가 남아 있는데 refresh만 반복하거나, 현재 화면만 바꾸면 되는데 모든 `posts` 태그를 무효화하면 의도보다 넓게 동작한다.

---

## 자주 하는 실수

### 1) mutation 뒤에 무조건 router.refresh를 붙인다

서버 캐시가 그대로라면 같은 값을 다시 받을 수 있다. 새 요청을 보내는 것과 새 데이터를 만드는 것은 다르다.

### 2) 모든 변경에 revalidatePath("/", "layout")를 쓴다

문제는 해결되지만 너무 넓은 범위를 무효화한다. 어떤 데이터가 바뀌었는지 표현하지 못하고 캐시 이점도 줄어든다.

### 3) revalidateTag를 인자 하나로 호출한다

Next.js 16에서 `revalidateTag(tag)` 단일 인자 형태는 deprecated 상태다. stale-while-revalidate가 목적이라면 `revalidateTag(tag, "max")`처럼 동작을 명시한다.

### 4) tag 이름을 화면 이름으로 만든다

`home-page`, `dashboard-page`처럼 만들면 path 기반 무효화와 차이가 줄어든다. `posts`, `post-123`, `user-7`처럼 데이터 기준으로 이름을 짓는 편이 관계를 파악하기 쉽다.

---

## 정리

- DB 변경과 Next.js 캐시 무효화는 별개의 작업이다
- `router.refresh()`는 서버 측 캐시를 무효화하지 않는다
- 화면 기준으로 갱신할 때는 `revalidatePath`를 사용할 수 있다
- 여러 화면이 같은 데이터를 쓴다면 tag로 연결하는 편이 관리하기 쉽다
- 사용자가 방금 바꾼 값을 바로 봐야 한다면 `updateTag`가 어울린다
- 약간 이전 값을 보여줘도 된다면 `revalidateTag(tag, "max")`를 고려할 수 있다

---

## 마무리 하며

처음에는 캐시 때문에 화면이 안 바뀌면 캐시를 전부 지우는 게 가장 확실하다고 생각했다. 실제로 그렇게 하면 문제는 사라진다. 대신 왜 캐시했는지도 같이 사라진다.

중요한 건 API 이름을 외우는 것보다 변경된 데이터와 그 데이터를 사용하는 화면의 관계를 먼저 그리는 일이었다. 어디까지 오래된 값을 허용할지 정하면 어떤 무효화 방식을 써야 할지도 조금 더 명확해진다.
