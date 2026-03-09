---
title: "Next.js 에러 핸들링 전략: error.tsx와 notFound"
date: "2026-02-23"
category: "Dev"
---

### `error.tsx`
`error.tsx` 파일을 이용해 해당 경로 세그먼트에서 발생하는 예상치 못한 오류를 캐치하고 사용자에게 복구 UI를 제공할 수 있습니다.

![Error Handling](https://velog.velcdn.com/images/tngur0716/post/f1021fd8-acad-48dc-8c7e-51c82f0a4796/image.png)

```tsx
'use client';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
```

---

### `notFound` function 
존재하지 않는 리소스를 요청할 때는 `notFound()` 함수를 사용하여 가장 가까운 `not-found.tsx` 파일을 렌더링할 수 있습니다.

```tsx
if (!invoice) {
  notFound();
}
```

`notFound`는 일반적인 `error.tsx`보다 우선순위가 높아 더 구체적인 에러 대응이 가능합니다.
