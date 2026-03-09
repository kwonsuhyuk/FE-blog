---
title: "Next.js 데이터 페칭과 렌더링 전략: Streaming과 Suspense"
date: "2026-02-11"
category: "Dev"
---

## Server Components를 이용한 데이터 페칭
서버 컴포넌트를 사용하면 비동기 작업을 직접 수행할 수 있고, 민감한 로직을 서버에 유지하며 데이터베이스에 직접 접근할 수 있습니다.

---

### Request Waterfalls와 병렬 페칭
의존적인 요청으로 인한 성능 저하를 방지하기 위해 `Promise.all()`을 사용한 병렬 페칭을 고려해야 합니다.

---

### Static vs Dynamic Rendering
정적 렌더링은 로딩 속도가 빠르고 SEO에 유리하며, 동적 렌더링은 실시간 데이터와 개인화된 콘텐츠 제공에 적합합니다.

---

### Streaming과 React Suspense
페이지의 일부분이 준비되는 대로 점진적으로 전송하는 스트리밍 기술을 사용하면 로딩 체감 속도를 크게 개선할 수 있습니다.

##### 1. `loading.tsx`
전체 페이지 단위로 스트리밍할 때 사용합니다.

##### 2. React Suspense
더 세분화된 컴포넌트 단위로 스트리밍할 때 사용하며, `fallback`을 통해 로딩 UI를 제공합니다.

```tsx
<Suspense fallback={<RevenueChartSkeleton />}>
  <RevenueChart />
</Suspense>
```

데이터 페칭 로직은 해당 데이터를 사용하는 컴포넌트 내부로 이동시키는 것이 Suspense의 경계를 설정하는 데 유리합니다.
