---
title: "Next.js 미들웨어(Middleware) 활용 가이드"
date: "2026-03-05"
category: "Dev"
---

![Middleware](https://velog.velcdn.com/images/tngur0716/post/f9e09d76-6836-4e16-aa5d-4ed0aee18e93/image.png)

## Middleware란?
미들웨어를 사용하면 요청이 완료되기 전, 즉 페이지가 렌더링되기 전에 서버 측에서 코드를 실행할 수 있습니다. 주로 인증, 권한 부여, 리다이렉트 등에 사용됩니다.

### 주요 사용 사례
- **인증 및 권한 부여**: 세션 쿠키 확인 후 접근 제한
- **서버 측 리디렉션**: 조건에 따른 페이지 이동
- **경로 다시 쓰기 (Rewrites)**
- **로깅 및 분석**

### `middleware.ts` 구현
프로젝트 루트에 작성하며, `matcher`를 통해 특정 경로에만 적용할 수 있습니다.

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

미들웨어는 가볍고 빠르게 응답해야 하므로 복잡한 DB 작업이나 무거운 계산은 피하는 것이 좋습니다.
