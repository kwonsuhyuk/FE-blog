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
category: "Dev"
---
```

### 필수 입력 항목:
- **title**: 포스트의 제목
- **date**: 작성일 (YYYY-MM-DD 형식)
- **category**: `Dev`, `Experience`, `회고` 중 하나 (새로운 카테고리 입력 시 자동으로 추가됨)

### 포스트 특징:
- **자동 미리보기**: `description`을 따로 작성하지 않아도 본문 내용 중 첫 2~3줄이 메인/목록 페이지에 자동으로 표시됩니다.
- **이미지**: `public/` 폴더에 이미지를 넣고 `![설명](/이미지명.png)` 형식으로 본문에 삽입할 수 있습니다.

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
