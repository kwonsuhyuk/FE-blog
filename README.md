# suhyukLog | FE Developer Blog

권수혁의 프론트엔드 개발 블로그입니다. Next.js와 Tailwind CSS로 구축되었습니다.

## ✍️ 새 포스트 작성 방법

블로그에 새로운 글을 추가하려면 다음 단계를 따르세요:

1. `posts/` 디렉토리에 새로운 `.md` 파일을 생성합니다. (예: `my-new-post.md`)
2. 파일 최상단에 다음과 같이 **Frontmatter**를 작성합니다:

```markdown
---
title: "포스트 제목"
date: "2024-03-20"
description: "목록에 표시될 짧은 요약문입니다."
category: "Dev"
---
```

### 필수 입력 항목:
- **title**: 포스트의 제목
- **date**: 작성일 (YYYY-MM-DD 형식)
- **category**: `Dev`, `Experience`, `회고` 중 하나 (새로운 카테고리 입력 시 자동으로 추가됨)

### 선택 입력 항목:
- **description**: 포스트 목록에 노출될 설명 (입력하지 않으면 본문 내용 중 첫 2~3줄이 자동으로 추출되어 표시됩니다.)

3. Frontmatter 아래에 마크다운 문법으로 내용을 작성합니다.
4. GitHub `main` 브랜치에 `push`하면 GitHub Actions를 통해 자동으로 배포됩니다.

---

## 🛠 기술 스택
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Deployment**: GitHub Pages

## 🚀 로컬 실행 방법

```bash
npm install
npm run dev
```
