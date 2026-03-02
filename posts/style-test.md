---
title: "블로그 기능 및 마크다운 스타일 테스트"
date: "2026-03-02"
category: "Dev"
---

# 마크다운 스타일 테스트

이 포스트는 블로그의 다양한 마크다운 스타일과 컴포넌트들을 테스트하기 위해 작성되었습니다.

## 1. 코드 블록 테스트 (Syntax Highlighting)

프론트엔드 개발자에게 가장 중요한 코드 블록 스타일입니다.

```typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

const welcomeUser = (user: User): string => {
  return `안녕하세요, ${user.name}님! 당신의 역할은 ${user.role}입니다.`;
};

console.log(welcomeUser({ id: 1, name: 'suhyuk', role: 'admin' }));
```

## 2. 이미지 테스트

이미지는 `public/` 디렉토리에 위치한 파일을 다음과 같이 불러올 수 있습니다.

![Next.js Logo](/next.svg)
*위 이미지는 프로젝트 기본 제공 이미지를 활용한 예시입니다.*

## 3. 리스트 스타일

- **순서 없는 리스트**
  - 중첩된 항목 1
  - 중첩된 항목 2
- **순서 있는 리스트**
  1. 첫 번째 단계
  2. 두 번째 단계

## 4. 인용구 (Blockquote)

> "사용자 경험(UX)은 단순한 디자인이 아니라, 사용자가 제품과 상호작용하며 느끼는 모든 감정의 총합입니다."

## 5. 강조 및 링크

**굵은 글씨**와 *기울임꼴*, 그리고 [GitHub 링크](https://github.com/kwonsuhyuk) 테스트입니다.

## 6. 긴 문장 (자동 미리보기 테스트용)

이 문장은 포스트 목록에서 미리보기로 노출되는지 확인하기 위한 긴 문장입니다. 제목 하단에 디바이더 없이 본문 내용이 자연스럽게 이어져야 하며, 약 2~3줄 정도의 분량으로 적절히 잘려서 보여야 합니다. 레이아웃이 깔끔하게 정돈되었는지 확인해 보세요!
