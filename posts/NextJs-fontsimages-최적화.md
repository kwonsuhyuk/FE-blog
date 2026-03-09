---
title: "Next.js 폰트와 이미지 최적화 전략"
date: "2026-02-05"
category: "Dev"
---

# fonts 최적화
커스텀 글꼴 로드 시 발생하는 Layout Shift 문제를 해결하기 위해 `next/font`를 사용합니다. Next.js는 빌드 시 폰트를 다운로드하여 정적 파일로 호스팅함으로써 추가 네트워크 요청을 제거합니다.

- 폰트 추가 및 적용하기 
```ts
import { Inter } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });

// layout.tsx
<body className={`${inter.className}`}>{children}</body>
```

---
# Images 최적화
기존 `<img>` 태그의 반응형 처리, 레이지 로딩, 레이아웃 이동 방지 문제를 `next/image`가 자동으로 해결해줍니다.

```tsx
<Image
  src="/hero-desktop.png"
  width={1000}
  height={760}
  className="hidden md:block"
  alt="Screenshots of the dashboard project"
/>
```

---
출처 : https://nextjs.org/docs
