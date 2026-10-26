---
title: "기능은 잘 되는데 왜 테스트가 필요할까: Playwright로 사용자 흐름 검증하기"
date: "2026-10-26"
category: "Dev"
tags: ["Playwright", "Testing", "Frontend"]
---

기능을 하나 만들 때마다 브라우저를 열고 로그인한 뒤 버튼을 눌러봤다. 작은 프로젝트에서는 이 정도면 충분하다고 생각했는데, 수정할 기능이 늘어나면서 방금 확인한 부분을 다음 변경에서 다시 깨뜨리는 일이 생겼다.

「루프 엔지니어링」 글에서 Playwright를 검증 도구로 짧게 넣은 적이 있다. 그때는 테스트 명령이 있다는 것만 중요하게 봤다. 이번에는 실제로 무엇을 E2E 테스트로 남겨야 하는지 정리해봤다.

## E2E 테스트란

E2E(End-to-End) 테스트는 사용자가 서비스를 이용하는 흐름을 처음부터 끝까지 확인하는 테스트다.

```text
로그인
→ 게시글 작성
→ 목록에서 확인
→ 내용 수정
→ 삭제
```

함수 하나의 반환값을 검사하는 대신 브라우저를 직접 실행하고, 사용자가 보는 화면과 버튼을 통해 기능을 검증한다.

![로그인부터 결과 확인까지 이어지는 E2E 테스트 흐름](/FE-blog/playwright-e2e-user-flow.png)

| 구분 | 확인하는 것 | 예시 |
| --- | --- | --- |
| 유닛 테스트 | 작은 로직 하나 | 가격 계산 함수 |
| 컴포넌트 테스트 | UI 한 부분의 동작 | 모달 열기, 폼 검증 |
| E2E 테스트 | 실제 사용자 흐름 | 로그인 후 게시글 작성 |

E2E 테스트가 다른 테스트를 전부 대신하는 것은 아니다. 실행 시간이 더 오래 걸리고 실패 원인도 넓다. 대신 여러 컴포넌트와 API가 연결됐을 때 실제로 서비스가 동작하는지 확인할 수 있다.

> E2E 테스트는 코드가 맞는지보다 사용자가 목적을 달성할 수 있는지를 확인한다.

---

## 모든 기능을 테스트할 필요는 없다

처음에는 페이지마다 테스트를 하나씩 만들면 된다고 생각했다. 그런데 페이지 수와 사용자 흐름은 같은 개념이 아니었다.

예를 들어 게시글 서비스라면 다음 흐름부터 잡을 수 있다.

1. 사용자가 로그인할 수 있다
2. 게시글을 작성하고 목록에서 확인할 수 있다
3. 자신이 작성한 게시글을 수정할 수 있다
4. 다른 사용자의 게시글은 수정할 수 없다

이 네 가지가 서비스의 핵심이라면 색상 변경이나 문구 수정이 있어도 테스트의 의미는 유지된다.

반대로 다음처럼 구현 세부사항을 확인하면 테스트가 쉽게 깨진다.

```text
X : 특정 div의 세 번째 자식에 active 클래스가 붙는다
O : 사용자가 선택한 탭의 내용이 화면에 보인다
```

Playwright의 [공식 Best Practices](https://github.com/microsoft/playwright/blob/main/docs/src/best-practices-js.md)도 사용자가 보고 조작하는 동작을 테스트하고, 함수명이나 CSS class 같은 구현 세부사항에 의존하지 말라고 설명한다.

→ 테스트할 대상을 페이지가 아니라 **실패하면 서비스가 곤란해지는 사용자 흐름**으로 고르는 편이 낫다.

---

## Playwright 시작하기

기존 프로젝트에 Playwright를 설치한다.

```bash
npm init playwright@latest
```

설정 과정에서 테스트 폴더, GitHub Actions 추가 여부, 테스트할 브라우저 등을 선택할 수 있다.

Next.js 개발 서버를 테스트와 함께 실행하려면 `playwright.config.ts`에 `webServer`를 설정한다.

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

처음부터 Chrome, Firefox, Safari 환경을 전부 돌릴 필요는 없다고 생각한다. 핵심 흐름 몇 개를 Chromium에서 안정적으로 만드는 것이 먼저다. 브라우저 호환성이 중요한 프로젝트라면 그다음에 범위를 넓힐 수 있다.

---

## 첫 번째 테스트는 가장 중요한 흐름으로 만든다

게시글 작성 흐름을 테스트한다고 가정해보자.

```ts
// e2e/post-create.spec.ts
import { test, expect } from "@playwright/test";

test("로그인한 사용자가 게시글을 작성한다", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("이메일").fill("test@example.com");
  await page.getByLabel("비밀번호").fill("test-password");
  await page.getByRole("button", { name: "로그인" }).click();

  await page.getByRole("link", { name: "글쓰기" }).click();
  await page.getByLabel("제목").fill("Playwright 테스트 글");
  await page.getByLabel("내용").fill("사용자 흐름을 검증한다.");
  await page.getByRole("button", { name: "등록" }).click();

  await expect(page).toHaveURL(/\/posts\/[^/]+$/);
  await expect(
    page.getByRole("heading", { name: "Playwright 테스트 글" })
  ).toBeVisible();
});
```

코드를 읽으면 사용자가 무엇을 하는지 그대로 보인다. 테스트 코드가 구현 코드보다 시나리오 문서에 가깝게 읽히는 것이 좋았다.

## 여기서 중요한 포인트 - 첫 테스트

- 클릭만 하지 말고 마지막에 사용자가 기대하는 결과를 검증한다
- URL과 화면 내용을 함께 확인하면 실패 지점을 좁히기 쉽다
- 하나의 테스트에는 하나의 사용자 목적을 담는다

---

## CSS 선택자보다 사용자가 보는 이름을 사용한다

처음 테스트를 작성하면 `class`나 `id`로 요소를 찾기 쉽다.

```ts
// X : DOM 구조와 스타일에 의존
await page.locator(".login-form > button.primary").click();

// O : 사용자가 인식하는 역할과 이름으로 찾기
await page.getByRole("button", { name: "로그인" }).click();
```

CSS class는 디자인을 바꾸면서 쉽게 달라진다. 반면 로그인 버튼이라는 역할은 기능이 유지되는 동안 잘 바뀌지 않는다.

`getByRole`, `getByLabel`, `getByText`를 사용하면 테스트 안정성뿐 아니라 접근성 문제도 같이 드러난다. input과 label이 연결되지 않았다면 `getByLabel`로 찾기 어렵고, 아이콘 버튼에 이름이 없다면 `getByRole`이 모호해진다.

테스트하기 어려운 UI가 사용자에게도 이해하기 어려운 UI일 수 있다는 뜻이다.

---

## waitForTimeout을 넣기 전에 기다릴 조건을 찾는다

API 응답이 늦어서 테스트가 실패하면 시간을 고정해서 기다리고 싶어진다.

```ts
// X : 무조건 2초 대기
await page.waitForTimeout(2000);
await expect(page.getByText("저장 완료")).toBeVisible();
```

로컬에서는 통과해도 CI가 느리면 2초를 넘길 수 있다. 반대로 응답이 100ms 만에 끝나도 나머지 시간을 기다린다.

![고정 시간 대기와 화면 상태 기반 대기의 차이](/FE-blog/playwright-auto-waiting.png)

Playwright의 assertion은 조건이 만족될 때까지 자동으로 재시도한다.

```ts
// O : 화면이 원하는 상태가 될 때까지 기다림
await expect(page.getByText("저장 완료")).toBeVisible();
```

특정 API 완료가 중요한 경우에는 응답 자체를 기다릴 수도 있다.

```ts
const saveResponse = page.waitForResponse(
  (response) =>
    response.url().includes("/api/posts") &&
    response.request().method() === "POST"
);

await page.getByRole("button", { name: "등록" }).click();
await saveResponse;
```

[Playwright 테스트 작성 문서](https://github.com/microsoft/playwright/blob/main/docs/src/writing-tests-js.md)는 actionability 검사와 비동기 assertion을 통해 수동 대기를 줄이는 방식을 안내한다.

→ 시간을 기다리는 대신 **화면이 어떤 상태가 되어야 다음 단계로 갈 수 있는지**를 기다린다.

---

## 테스트끼리 데이터에 의존하지 않게 한다

E2E 테스트가 불안정해지는 가장 흔한 원인 중 하나는 테스트 데이터다.

```text
테스트 A가 게시글을 생성한다
→ 테스트 B가 그 게시글을 수정한다
→ 테스트 A가 실패하면 B도 같이 실패한다
```

각 테스트는 단독으로 실행해도 통과해야 한다. 필요한 데이터는 테스트가 직접 준비하고 끝난 뒤 정리하는 편이 좋다.

```ts
test("게시글을 수정한다", async ({ page, request }) => {
  const response = await request.post("/api/test/posts", {
    data: { title: "수정 전 제목" },
  });
  const post = await response.json();

  await page.goto(`/posts/${post.id}/edit`);
  await page.getByLabel("제목").fill("수정 후 제목");
  await page.getByRole("button", { name: "저장" }).click();

  await expect(
    page.getByRole("heading", { name: "수정 후 제목" })
  ).toBeVisible();
});
```

여기서 `/api/test/posts` 같은 준비용 API는 테스트 환경에서만 열어야 한다. 실제 운영 환경에 테스트 데이터를 만드는 관리용 경로가 남으면 안 된다.

DB를 사용하는 테스트라면 운영 DB가 아니라 별도의 test 또는 staging 환경을 사용한다. 테스트를 다시 실행해도 같은 결과가 나오도록 데이터를 통제하는 것이 중요하다.

---

## 로그인은 매 테스트마다 반복하지 않는다

로그인이 모든 시나리오의 시작이라면 테스트마다 이메일과 비밀번호를 입력할 수 있다. 동작은 하지만 테스트가 느려지고 인증 서버 상태에 영향을 많이 받는다.

Playwright는 로그인한 브라우저 상태를 파일로 저장해 재사용할 수 있다.

```ts
// e2e/auth.setup.ts
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("로그인 상태 저장", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("이메일").fill(process.env.E2E_EMAIL!);
  await page.getByLabel("비밀번호").fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL("/dashboard");
  await page.context().storageState({ path: authFile });
});
```

인증 파일에는 cookie와 session 정보가 들어갈 수 있으므로 Git에 올리면 안 된다.

```gitignore
playwright/.auth
```

테스트 계정도 실제 사용자 계정과 분리한다. E2E 테스트는 반복해서 데이터를 만들고 지우기 때문에 권한과 데이터 범위를 제한하는 편이 안전하다.

---

## CI에서는 실패 원인을 남겨야 한다

로컬에서는 브라우저를 보면서 실패 지점을 찾을 수 있다. CI에서는 실행 화면이 없기 때문에 결과물 없이 실패하면 원인을 찾기 어렵다.

그래서 다음 세 가지를 남기는 것이 도움이 된다.

- 실패 시 screenshot
- trace
- HTML report

```ts
// playwright.config.ts
use: {
  screenshot: "only-on-failure",
  trace: "on-first-retry",
},
```

trace에는 페이지 이동, 클릭, 네트워크 요청, 콘솔 로그가 시간 순서대로 기록된다. 단순히 재시도를 늘리는 것보다 왜 실패했는지 확인할 자료를 남기는 것이 먼저다.

`.github/workflows/e2e.yml`에는 브라우저 설치와 테스트 실행 단계를 추가한다.

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npx playwright test
```

CI에 붙이고 나면 PR을 올릴 때마다 사람이 브라우저에서 반복하던 핵심 흐름을 자동으로 확인할 수 있다.

---

## 자주 하는 실수

### 1) 화면에 있는 모든 것을 E2E로 테스트한다

테스트가 많아질수록 실행 시간과 관리 비용도 늘어난다. 핵심 사용자 흐름을 먼저 보호하고 세부 로직은 유닛 테스트로 내려보낸다.

### 2) waitForTimeout으로 실패를 숨긴다

대기 시간을 늘리면 당장은 통과할 수 있지만 테스트는 계속 느리고 불안정하다. 기다릴 화면 상태나 네트워크 조건을 찾는 편이 낫다.

### 3) 테스트 순서에 의존한다

전체 실행에서는 통과하고 단독 실행에서는 실패한다면 테스트끼리 상태를 공유하고 있을 가능성이 크다.

### 4) 테스트용 계정과 데이터를 운영 환경에서 사용한다

자동화 테스트는 데이터를 반복해서 변경한다. 별도의 환경과 제한된 계정을 사용해야 한다.

---

## 정리

- E2E 테스트는 사용자가 실제로 목적을 달성할 수 있는지 확인한다
- 페이지 수가 아니라 실패하면 중요한 사용자 흐름을 기준으로 작성한다
- CSS selector보다 role, label처럼 사용자가 인식하는 정보를 사용한다
- 고정 시간을 기다리지 말고 화면 상태와 응답 조건을 기다린다
- 각 테스트가 데이터를 직접 준비하고 다른 테스트에 의존하지 않게 한다
- CI에서는 screenshot, trace, report를 남겨 실패 원인을 확인한다

---

## 마무리 하며

예전에는 직접 한 번 눌러보고 잘 되면 테스트가 끝났다고 생각했다. 하지만 그 확인은 다음 기능을 수정하는 순간 다시 해야 했다.

처음부터 테스트를 많이 만드는 것보다 로그인, 생성, 권한처럼 깨졌을 때 바로 서비스 사용이 막히는 흐름부터 하나씩 남기는 편이 현실적이라고 생각한다. 다음 프로젝트에서는 기능 구현이 끝난 뒤 몰아서 추가하지 않고, 핵심 흐름이 완성될 때마다 E2E 테스트도 같이 붙여보려고 한다.
