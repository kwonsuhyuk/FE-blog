---
title: "마일로 프로젝트 시작 전에 Supabase 정리"
date: "2026-10-19"
category: "Project"
tags: ["Supabase", "Next.js", "PostgreSQL"]
---

마일로 프로젝트에서 백엔드 기능을 빠르게 붙이기 위해 Supabase를 사용해보려고 한다. 이름은 자주 들었지만 Firebase와 비슷한 도구라는 정도로만 알고 있어서, 프로젝트를 시작하기 전에 필요한 내용만 간단하게 정리해봤다.

## Supabase란

Supabase는 PostgreSQL을 중심으로 데이터베이스, 인증, 파일 저장소, 실시간 기능 등을 제공하는 BaaS(Backend as a Service)다.

직접 백엔드를 만든다면 서버를 구성하고, DB를 연결하고, 회원가입과 로그인 API도 만들어야 한다. Supabase를 사용하면 이런 기능을 하나의 프로젝트 안에서 바로 시작할 수 있다.

| 기능 | 하는 일 |
| --- | --- |
| Database | PostgreSQL 기반 데이터 저장 |
| Auth | 이메일, 소셜 로그인, 세션 관리 |
| Storage | 이미지와 파일 저장 |
| Realtime | DB 변경 사항 실시간 구독 |
| Edge Functions | 서버에서 실행할 별도 로직 작성 |

단순히 DB 화면을 제공하는 서비스라기보다, 프론트엔드에서 필요한 백엔드 기능을 묶어서 제공하는 도구에 가깝다.

---

## 왜 마일로에 사용하려고 하나

프로젝트 초반부터 인증 서버와 파일 업로드까지 전부 직접 만들면, 실제 기능을 만들기 전에 준비할 것이 많아진다.

Supabase를 선택한 가장 큰 이유는 **구현 속도와 데이터 구조를 직접 다룰 수 있다는 점**이다.

- PostgreSQL이라 테이블과 관계를 SQL 기준으로 설계할 수 있다
- 인증과 DB를 연결하기 편하다
- 이미지 업로드를 위해 별도 스토리지를 먼저 구성하지 않아도 된다
- 대시보드에서 데이터를 확인할 수 있어 개발 초반 디버깅이 편하다

Firebase도 비슷한 역할을 하지만, Supabase는 관계형 데이터베이스인 PostgreSQL을 사용한다. 데이터 사이의 관계가 있는 프로젝트라면 익숙한 테이블, 외래키, JOIN 구조로 접근할 수 있다는 점이 좋았다.

→ 백엔드를 몰라도 된다는 뜻은 아니다. 반복되는 기반 작업을 줄이고 서비스 로직에 시간을 더 쓰기 위한 선택에 가깝다.

---

## Next.js에서 시작하는 방법

먼저 Supabase에서 프로젝트를 만들고 패키지를 설치한다.

```bash
npm install @supabase/supabase-js @supabase/ssr
```

프로젝트의 Connect 메뉴에서 URL과 publishable key를 확인한 뒤 `.env.local`에 넣는다.

```env
NEXT_PUBLIC_SUPABASE_URL=프로젝트_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=publishable_key
```

`NEXT_PUBLIC_`이 붙은 값은 브라우저에도 포함될 수 있다. publishable key는 원래 공개 환경에서 사용하는 키다. 이 키 자체를 숨기는 대신 뒤에서 설명할 RLS로 데이터 접근 범위를 제한한다.

Next.js App Router에서는 브라우저용 client와 서버용 client를 나눠두는 편이 좋다.

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

브라우저에서 사용자 입력이나 로그인 상태와 함께 요청할 때 이 client를 사용한다. Server Component, Server Action, Route Handler에서는 cookie를 다루는 서버용 client를 따로 만든다.

공식 [Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)에도 browser client와 server client가 분리되어 있다. 처음에는 파일이 왜 두 개인지 헷갈렸는데, 실행 위치와 세션을 다루는 방식이 다르기 때문이다.

## 여기서 중요한 포인트

- Client Component와 Server Component는 같은 환경에서 실행되지 않는다
- 공통 client 하나를 아무 곳에서나 import하지 않는다
- 키 이름은 오래된 예제보다 현재 공식 문서의 publishable key를 기준으로 본다

---

## 데이터 읽고 추가하기

Supabase client를 만들면 SQL을 직접 작성하지 않고도 기본적인 조회와 추가를 할 수 있다.

```ts
const { data, error } = await supabase
  .from("projects")
  .select("id, name, created_at")
  .order("created_at", { ascending: false });
```

데이터 추가도 비슷하다.

```ts
const { data, error } = await supabase
  .from("projects")
  .insert({
    name: "Milo",
    owner_id: userId,
  })
  .select()
  .single();
```

응답은 `data`와 `error`로 나뉜다. 요청이 실패해도 항상 throw되는 방식은 아니기 때문에 error를 확인해야 한다.

```ts
if (error) {
  throw new Error(`프로젝트 생성 실패: ${error.message}`);
}
```

처음에는 SDK 문법이 편해 보여도 결국 어떤 테이블을 만들고, 어떤 관계를 둘지 결정해야 한다. Supabase가 데이터 모델링까지 대신해주는 것은 아니다.

---

## RLS는 선택이 아니다

Supabase를 사용할 때 가장 먼저 이해해야 할 부분은 RLS(Row Level Security)라고 생각한다.

RLS는 사용자마다 접근할 수 있는 row를 데이터베이스에서 제한하는 기능이다. 예를 들어 로그인한 사용자가 자신의 프로젝트만 조회하게 만들 수 있다.

```sql
create policy "사용자는 자신의 프로젝트만 조회"
on public.projects
for select
to authenticated
using ((select auth.uid()) = owner_id);
```

프론트엔드에 publishable key가 들어가도 되는 이유는 이 key가 모든 데이터에 접근할 수 있는 비밀 열쇠가 아니기 때문이다. 실제 접근 권한은 로그인 정보와 RLS policy를 통해 결정된다.

반대로 secret key는 RLS를 우회할 수 있다. 브라우저 코드나 GitHub에 올라가는 파일에 넣으면 안 된다.

```text
publishable key : 브라우저에서 사용 가능, RLS 적용
secret key      : 서버에서만 사용, RLS 우회 가능
```

[Supabase RLS 문서](https://supabase.com/docs/guides/database/postgres/row-level-security)는 외부에 노출되는 schema의 모든 table에 RLS를 적용하라고 안내한다.

> Supabase를 쓴다고 데이터가 자동으로 안전해지는 것은 아니다. 허용할 데이터를 policy로 직접 정해야 한다.

---

## 사용하면서 기대하는 점

마일로에서는 처음부터 모든 기능을 사용하기보다 필요한 부분부터 붙일 생각이다.

1. PostgreSQL로 핵심 데이터 구조 만들기
2. Auth로 사용자 구분하기
3. RLS로 사용자별 접근 범위 제한하기
4. 이미지가 필요해지면 Storage 연결하기

이 순서라면 기능을 빠르게 확인하면서도 인증과 권한을 뒤로 미루지 않을 수 있다.

Supabase의 장점은 시작이 빠르다는 것이다. 동시에 서비스가 커질수록 DB 설계, migration, index, 권한 정책은 결국 직접 관리해야 한다. 대시보드에서 클릭 몇 번으로 만들 수 있어도 운영할 구조라면 SQL migration으로 기록을 남기는 편이 좋다고 생각한다.

---

## 자주 놓칠 것 같은 부분

### 1) publishable key를 비밀 키로 생각한다

브라우저에 포함되는 키라 숨길 수 없다. 중요한 건 key를 감추는 것이 아니라 RLS와 권한을 제대로 설정하는 것이다.

### 2) secret key를 NEXT_PUBLIC 환경 변수에 넣는다

secret key는 RLS를 우회한다. `NEXT_PUBLIC_`을 붙이거나 Client Component에서 사용하면 안 된다.

### 3) 대시보드에서만 table을 수정한다

처음에는 빠르지만 나중에 개발 환경과 운영 환경의 schema가 달라질 수 있다. 변경 사항은 migration으로 남기는 습관이 필요하다.

### 4) RLS를 마지막에 설정한다

기능을 다 만든 뒤 권한을 붙이면 기존 쿼리가 한꺼번에 막히기 쉽다. table을 만들 때 접근 정책도 같이 생각하는 편이 낫다.

---

## 정리

- Supabase는 PostgreSQL을 중심으로 Auth, Storage, Realtime 등을 제공하는 BaaS다
- 백엔드를 없애는 도구라기보다 반복되는 기반 작업을 줄이는 도구에 가깝다
- Next.js에서는 browser client와 server client를 구분한다
- publishable key는 공개 환경에서 사용할 수 있지만 RLS가 제대로 설정되어야 한다
- secret key는 RLS를 우회하므로 서버 밖으로 노출하면 안 된다
- 작은 프로젝트라도 schema와 policy 변경은 migration으로 남기는 편이 좋다

---

## 마무리 하며

Supabase를 사용하면 인증과 DB를 빠르게 연결할 수 있다는 점이 가장 기대된다. 다만 편한 SDK만 보고 시작하면 권한이나 데이터 구조를 놓치기 쉬워 보인다.

마일로에서는 우선 필요한 기능만 작게 연결하고, table과 RLS를 왜 이렇게 설계했는지 설명할 수 있는 상태로 만들어보려고 한다. 실제로 적용하면서 막힌 부분은 다음 글에 이어서 정리해봐야겠다.
