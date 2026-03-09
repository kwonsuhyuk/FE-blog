---
title: "Next.js 14: 레이아웃(Layouts)과 페이지(Pages) 생성하기"
date: "2026-01-18"
category: "Dev"
---

## Nested routing
Next.js는 파일 시스템 기반 라우팅(file-system routing)을 사용합니다.

![Next.js Routing](https://velog.velcdn.com/images/tngur0716/post/0e57ec35-d93a-4616-94a6-534cf3f407db/image.png)

- `/app/dashboard/page.tsx`는 `/dashboard` 경로와 연관됩니다.
- 해당 경로 폴더 안에 `page.tsx` 파일을 만들어서 페이지를 생성합니다.

---
## layout.tsx
여러 페이지에 공통적으로 적용하고자 하는 레이아웃을 정의 할 수 있습니다.

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

### layouts 사용 시 장점
네비게이션 시 페이지 구성 요소만 업데이트 되고, 레이아웃은 다시 렌더링 되지 않습니다. 이를 **partial rendering**이라고 합니다.
