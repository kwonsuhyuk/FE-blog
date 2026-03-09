---
title: "Next.js에서의 네비게이션 최적화: Link 컴포넌트"
date: "2026-01-24"
category: "Dev"
---

## 왜 navigation 을 최적화 해야 하는가?
기존 HTML의 `<a>` 태그를 사용하면 페이지 이동 시 전체 페이지가 새로고침되어 사용자 경험이 저하됩니다.

---

## `<Link>` component
Client-side navigation을 제공하여 전체 페이지를 새로 로드하지 않고 필요한 부분만 변경합니다.

## Automatic code-splitting and prefetching

### Automatic code-splitting
각 페이지에 필요한 자바스크립트만 로드하여 초기 로딩 시간을 단축합니다.

### Prefetching
브라우저가 백그라운드에서 다른 페이지의 리소스를 미리 가져와 페이지 전환 시간을 크게 줄입니다.

---

## 활성화된 링크 표시하기
`usePathname()` 훅을 사용하여 현재 경로를 가져오고, `clsx` 라이브러리를 통해 스타일을 조건부로 적용할 수 있습니다.

```tsx
const pathname = usePathname();

{links.map((link) => (
  <Link
    key={link.name}
    href={link.href}
    className={clsx(
      'flex h-[48px] ...',
      { 'bg-sky-100 text-blue-600': pathname === link.href }
    )}
  >
    <p className="hidden md:block">{link.name}</p>
  </Link>
))}
```
