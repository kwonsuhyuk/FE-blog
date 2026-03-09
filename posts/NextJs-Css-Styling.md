---
title: "Next.js 스타일링 가이드: CSS Modules와 clsx"
date: "2026-01-30"
category: "Dev"
---

## CSS Modules
고유 클래스 이름을 자동으로 생성하여 스타일 충돌을 방지합니다.

```jsx
import styles from '@/app/ui/home.module.css';

<div className={styles.shape} />;
```

## clsx
조건부 스타일을 깔끔하게 적용하고 싶을 때 유용한 라이브러리입니다.

```jsx
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
    </span>
  );
}
```
---
출처 : https://nextjs.org/docs
