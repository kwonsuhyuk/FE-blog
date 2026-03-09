---
title: "Next.js 정적 사이트 생성(SSG)과 ISR 이해하기"
date: "2026-02-28"
category: "Dev"
---

![SSG](https://velog.velcdn.com/images/tngur0716/post/ef1a166b-7519-473d-b663-1df5820cfeda/image.png)

## 정적 사이트 생성 (SSG)
프로젝트 빌드 시점에 미리 HTML을 렌더링하는 방식입니다. 컨텐츠가 자주 변경되지 않는 사이트에서 로딩 속도와 SEO 최적화에 탁월합니다.

### 왜 SSG를 사용할까?
1. 빠른 초기 로딩 속도 
2. 뛰어난 SEO 
3. 높은 확장성과 보안 향상

## 정적 사이트 구현 하기
Next.js의 Pages Router에서는 `getStaticProps`와 `getStaticPaths`를 통해 구현합니다.

```js
export async function getStaticProps() {
  const res = await axios('/products/');
  const products = res.data;
  return { props: { products } };
}
```

## ISR(Incremental Static Regeneration)
SSG의 단점인 '데이터 업데이트' 문제를 해결하기 위해, 일정 주기마다 페이지를 백그라운드에서 재생성하는 기술입니다.

```js
export async function getStaticProps() {
  return {
    props: { ... },
    revalidate: 60, // 60초마다 갱신
  };
}
```
이를 통해 정적 콘텐츠의 속도와 동적 데이터의 최신성을 모두 챙길 수 있습니다.
