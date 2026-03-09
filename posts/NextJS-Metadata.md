---
title: "Next.js 메타데이터(Metadata)와 SEO 최적화"
date: "2026-02-24"
category: "Dev"
---

## Metadata 란 ?
웹페이지에 대한 추가 정보를 제공하는 데이터로, 주로 `<head>` 내부에 위치하여 검색엔진 최적화(SEO)와 소셜 미디어 공유 시의 가독성을 높이는 데 기여합니다.

---

### Metadata 추가하기

1. **Config-based (layout.tsx / page.tsx)**
정적 객체나 `generateMetadata` 함수를 통해 정의합니다.

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard.',
};
```

2. **File-based**
특정 파일명을 사용하여 자동으로 메타데이터를 적용합니다.
- `favicon.ico`, `robots.txt`, `sitemap.xml`
- `opengraph-image.jpg`, `twitter-image.jpg`

메타데이터를 적절히 활용하면 검색 엔진 결과 순위를 높이고 사용자에게 매력적인 공유 링크를 제공할 수 있습니다.
