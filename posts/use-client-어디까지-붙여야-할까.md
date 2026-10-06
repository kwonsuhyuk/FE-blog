---
title: "use client는 어디까지 붙여야 할까"
date: "2026-10-06"
category: "Dev"
---

이 블로그 홈 화면을 빌드해서 HTML을 열어봤더니, 글 목록이 마크업에 한 줄도 없었다. 브라우저에서는 멀쩡히 보이는데 HTML에는 skeleton 3개만 들어 있었다.

원인을 따라가 보니 결국 `"use client"`를 어디에 붙이느냐의 문제였다. 내 블로그 코드를 직접 뜯어보면서 알게 된 것들을 정리해보려고 한다.

## 먼저 확인한 방법

Next.js 16, `output: "export"`(정적 배포) 환경이다. 빌드하고 결과물을 그대로 열어봤다.

```bash
npm run build

# 홈 HTML에 글 제목이 실제 마크업으로 들어갔는지
grep -o "<h3" out/index.html | wc -l             # 0
grep -o "animate-pulse" out/index.html | wc -l   # 3 (skeleton)
```

브라우저 개발자 도구로 보면 JS가 실행된 뒤의 화면이라 이런 차이가 안 보인다. `out/index.html`은 JS가 돌기 전, 서버(빌드 시점)가 만든 HTML 그대로다.

수치로 정리하면 이랬다.

| 항목                         | 값                   |
| ---------------------------- | -------------------- |
| `index.html` 전체            | 약 91KB              |
| 그 중 RSC payload            | 약 79KB (87%)        |
| props로 직렬화된 글 개수     | 62개 (description만 47KB) |
| 마크업에 있는 글 제목        | 0개                  |
| skeleton                     | 3개                  |

화면에 보여주는 글은 5개인데 62개가 실려 있었고, 정작 HTML에는 그 5개가 없었다.

글 상세 페이지는 달랐다. `[slug]/page.tsx`는 서버 컴포넌트라서 본문이 `<p>`, `<h2>` 그대로 HTML에 들어 있다. 문제는 목록 쪽에만 있었다.

---

## 1. 페이지 전체가 클라이언트 컴포넌트였다

홈 화면 구조는 이랬다.

```tsx
// src/app/page.tsx (서버 컴포넌트)
export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return <HomeClient allPostsData={allPostsData} />;
}
```

```tsx
// src/app/HomeClient.tsx
"use client";

import { Hero } from "@/src/components/Hero";
import { PostCard } from "@/src/components/PostCard";
import { PostCardSkeleton } from "@/src/components/Skeleton";
import { motion } from "framer-motion";
```

`page.tsx`는 데이터만 읽고 `HomeClient`에 통째로 넘긴다. 이 블로그를 처음 만들 때 `PostsClient` 하나에 로직을 몰아넣고 시작했는데, 그 구조가 그대로 남아 있었다. `PostsClient`, `AboutClient`도 같은 모양이다.

`HomeClient`를 클라이언트로 만든 이유는 framer-motion의 `motion.div` 때문이었다. 애니메이션 몇 개 때문에 페이지 전체가 클라이언트가 된 셈이다.

여기서 놓치기 쉬운 게 있다.

> `"use client"`는 그 파일 하나에만 붙는 표시가 아니라, 그 파일이 import하는 것까지 전부 클라이언트로 끌고 가는 경계다.

`PostCard`는 훅도, 모션도 안 쓰는 순수한 표시용 컴포넌트다. 그런데 `HomeClient`가 import한다는 이유만으로 클라이언트 번들에 들어갔다.

## **여기서 중요한 포인트**

- "use client"는 파일 단위 표시가 아니라 **트리 단위 경계**다
- 경계가 위에 있을수록 그 아래 전부가 클라이언트 비용을 낸다
- 애니메이션 하나 때문에 페이지를 통째로 클라이언트로 만들 이유는 없다

---

## 2. mounted 가드가 서버 HTML을 skeleton으로 만들었다

글 목록이 HTML에 없던 직접적인 원인은 이 부분이었다.

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// ...
{!mounted ? (
  Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
) : (
  allPostsData.slice(0, 5).map((post) => (
    <PostCard key={post.slug} post={post} headingLevel="h3" />
  ))
)}
```

`useEffect`는 서버에서 실행되지 않는다. 그러니 서버가 HTML을 만드는 시점에는 `mounted`가 항상 `false`고, 그 결과 HTML에는 skeleton만 들어간다. 이 블로그를 만들 때 스켈레톤 UI를 넣었다고 정리해둔 적이 있는데, 그게 바로 이 부분이다.

문제는 글 데이터가 이미 props로 와 있다는 점이다. 기다릴 데이터가 없는데 skeleton을 보여주고 있었다.

같은 `mounted` 패턴이 `ThemeToggle`에도 있다. 거기는 이유가 있다.

```
ThemeToggle : theme은 localStorage/시스템 설정이라 서버가 모른다 → mounted 가드가 필요하다
HomeClient  : 글 목록은 서버가 이미 안다                         → mounted 가드가 필요 없다
```

→ `mounted` 가드는 **서버가 모르는 값**을 그릴 때만 쓰는 패턴이다. 서버가 아는 데이터를 가리는 데 쓰면 서버 렌더링의 이점만 버리게 된다.

## **여기서 중요한 포인트**

- 서버가 아는 데이터에는 skeleton이 필요 없다. skeleton은 "아직 모르는 값"을 기다릴 때 쓴다
- JS가 켜진 브라우저에서는 티가 안 나서 놓치기 쉽다
- 정적 배포라 서버가 요청마다 도는 건 아니지만, 빌드 시점 HTML에 뭐가 들어가는지는 똑같이 중요하다

---

## 3. 보여줄 5개를 위해 62개를 넘기고 있었다

```tsx
// HomeClient 안에서
allPostsData.slice(0, 5).map(...)
```

`slice(0, 5)`를 클라이언트 안에서 하고 있었다. 서버가 62개를 전부 props로 넘기고, 클라이언트가 그중 5개만 그린다.

서버 컴포넌트가 클라이언트 컴포넌트에 넘기는 props는 직렬화되어 payload에 실린다. 그래서 `description`(최대 500자)이 62개 전부 HTML 안에 들어가 있었다. 47KB가 이렇게 나왔다.

```tsx
// X : 전부 넘기고 클라이언트에서 자른다
<HomeClient allPostsData={allPostsData} />   // 안에서 slice(0, 5)

// O : 서버에서 자르고 넘긴다
const recentPosts = (await getSortedPostsData()).slice(0, 5);
```

→ props는 서버에서 클라이언트로 **보내는 데이터**다. 보낸 만큼 비용이 된다.

---

## 이렇게 나눠봤다

방향은 단순했다. 서버 컴포넌트(`page.tsx`)가 데이터를 자르고 렌더링하고, 애니메이션만 작은 클라이언트 컴포넌트로 감싼다.

```tsx
// src/components/FadeIn.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

```tsx
// src/app/page.tsx (여전히 서버 컴포넌트)
export default async function Home() {
  const recentPosts = (await getSortedPostsData()).slice(0, 5);

  return (
    <main>
      {/* ... */}
      {recentPosts.map((post, index) => (
        <FadeIn key={post.slug} delay={index * 0.1}>
          <PostCard post={post} headingLevel="h3" />
        </FadeIn>
      ))}
    </main>
  );
}
```

핵심은 `FadeIn`이 `children`을 받는다는 점이다. 클라이언트 컴포넌트 **안에** 서버 컴포넌트를 import하면 클라이언트가 되지만, `children`으로 **넘겨주면** 서버 컴포넌트인 채로 유지된다. `PostCard`는 서버에서 렌더링되고, `FadeIn`은 그걸 감싸기만 한다.

실제 저장소는 건드리지 않고 복사본에서 이렇게 바꿔 빌드해봤다.

| 항목                         | 전          | 후        |
| ---------------------------- | ----------- | --------- |
| `index.html` 전체            | 약 91KB     | 약 46KB   |
| RSC payload                  | 약 79KB     | 약 25KB   |
| `description`으로 직렬화된 글 | 62개 (47KB) | 0개       |
| 마크업에 있는 글 제목        | 0개         | 5개       |
| skeleton                     | 3개         | 0개       |

HTML이 절반으로 줄고, 목록 제목 5개가 마크업에 실제로 들어갔다. 목록 쪽에서 클라이언트로 남은 건 `FadeIn`과 화살표 애니메이션 두 개뿐이다.

## **여기서 중요한 포인트**

- 클라이언트 컴포넌트에 서버 컴포넌트를 `children`으로 넘길 수 있다. "use client"를 최말단으로 밀어낼 수 있는 이유가 이것이다
- 한계도 있다. framer-motion의 `initial`이 `opacity: 0`으로 HTML에 박히기 때문에, 마크업에는 있어도 JS가 뜨기 전에는 눈에 안 보인다
- `Hero`는 타이핑 애니메이션 때문에 여전히 클라이언트다. 이번에 측정한 건 목록 부분뿐이다

---

## 어디에 붙일지 판단하는 기준

| 이게 필요하면                                  | 어디에             |
| ---------------------------------------------- | ------------------ |
| 파일, DB, API에서 데이터 읽기                  | 서버               |
| `useState`, `useEffect`, 이벤트 핸들러         | 클라이언트         |
| `window`, `localStorage`, framer-motion        | 클라이언트         |
| 위 셋 어디에도 안 걸리는 순수 UI               | 서버 (기본값)      |

→ 기본값은 서버고, 위 조건에 걸리는 **가장 작은 단위**만 클라이언트로 뺀다.

---

## 자주 하는 실수

### 1) 페이지 최상단에 "use client"를 붙인다

상태 하나, 애니메이션 하나가 필요해도 페이지 전체를 클라이언트로 만들면 그 아래가 전부 따라온다. 필요한 부분만 잘라서 작은 컴포넌트로 뺀다.

### 2) 페이지마다 XxxClient를 하나씩 만든다

`page.tsx`는 얇게, `XxxClient`가 전부를 하는 구조다. 만들 때는 편한데 경계가 페이지 단위로 그어진다. 이 블로그가 딱 이랬고, `/posts` 페이지도 같은 증상이었다(skeleton 5개, 글 제목 마크업 0개).

### 3) 목록 전체를 props로 넘기고 클라이언트에서 자른다

`slice`, `filter`는 가능하면 서버에서 하고 필요한 만큼만 넘긴다. 필터를 사용자가 바꾸는 경우처럼 클라이언트에서 해야 하는 건 예외다.

### 4) 서버가 아는 데이터를 mounted 가드로 가린다

`mounted`는 서버가 모르는 값(테마, `localStorage` 등) 때문에 hydration 불일치가 생길 때 쓰는 것이다.

---

## 정리

- `"use client"`는 파일 하나가 아니라 import하는 트리 전체를 클라이언트로 만드는 경계다
- 기본은 서버 컴포넌트고, 상태, 이벤트, 브라우저 API, 모션이 필요한 곳만 클라이언트로 뺀다
- 서버 컴포넌트는 `children`으로 넘기면 서버 컴포넌트인 채로 클라이언트 안에 들어간다
- props는 서버에서 클라이언트로 보내는 데이터라서, 보낸 만큼 payload가 커진다
- `mounted` 가드는 서버가 모르는 값에만 쓴다
- 화면이 잘 보이는 것과 HTML에 뭐가 들어있는지는 다른 문제다. 빌드 결과를 열어봐야 보인다

---

## 마무리 하며

「루프 엔지니어링」 글에서 `CLAUDE.md` 예시를 쓰면서 "서버 컴포넌트가 기본, `use client`는 최말단에만"이라고 적어둔 적이 있다. 그런데 정작 내 블로그는 반대로 짜여 있었다.

화면에서 잘 보이니까 문제가 없다고 생각했는데, 브라우저는 JS가 다 돈 뒤의 모습을 보여주니 그럴 수밖에 없었다. 빌드 결과를 열어보기 전까지는 몰랐다. 규칙은 알고 있어도 내 코드에 적용했는지는 따로 확인해봐야 한다는 걸 다시 느껴서 정리해봤다!
