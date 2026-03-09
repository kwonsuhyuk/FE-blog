---
title: "Next.js에서 URL 검색 매개변수와 Debouncing 구현하기"
date: "2026-02-17"
category: "Dev"
---

## NextJS Search

### 왜 URL 검색 매개 변수를 사용할까 ?
1. Bookmarkable and Shareable URLs
2. Server-Side Rendering and Initial Load
3. Analytics and Tracking
    
### 검색기능 시 사용하는 NextJS hook
- `useSearchParams` : 현재 URL의 변수들에 접근 할 수 있게 해줌
- `usePathname` : 현재 주소의 경로를 보여줌
- `useRouter` : 클라이언트 구성요소 내의 경로간 탐색을 프로그래밍적으로 가능하게 함

### 검색 기능에 적용해보기

```tsx
'use client';
 
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
  
  return (
  	<input
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
  )
}
```

---

### Debouncing
연속된 이벤트 처리를 효율적으로 관리하기 위한 기술로, 특정 시간 동안 발생하는 이벤트 중 마지막 이벤트만을 처리하여 불필요한 요청을 줄입니다.

```tsx
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((term) => {
  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
}, 300);
```
