---
title: "React에서 onClick과 onBlur 이벤트 충돌 해결하기"
date: "2026-01-12"
category: "Dev"
---

```jsx
<textarea
  onBlur={() => setIsFormOpen(false)}
/>
<button onClick={handleButtonClick}>제출</button>
```
`onBlur`를 이용해 `textarea` 에 focus가 해제되면 form을 닫고 `onClick`을 이용해서 `button`을 클릭시에 내용을 제출하려고 하는 와중에, 버튼을 클릭하면 `onBlur`가 먼저 실행되어 폼이 닫혀버리는 문제가 발생했습니다.

### 문제 발생 이유 
이벤트 핸들러의 실행 순서가 `onBlur`가 `onClick`보다 우선이기 때문입니다.

```text
onBlur --> onClick
```

## 해결 방법
`onBlur` 보다 실행 순서가 빠른 이벤트인 `onMouseDown` 이벤트를 사용해야 합니다.

```text
onMouseDown --> onBlur --> onClick
```

이벤트 우선순위가 위와 같기에 `onMouseDown`을 사용하면 `onBlur` 보다 우선적으로 실행되어 폼이 정상적으로 제출된 후에 폼이 닫히게 됩니다. 

### 수정 코드 
```jsx
<button onMouseDown={handleButtonClick}>
  {buttonTitle}
</button>
```

---

### + `onMouseDown` 과 `onClick`의 차이점

##### `onClick` 
- 마우스를 뗄 때 이벤트가 발생한다.

##### `onMouseDown`
- 마우스를 눌렀을 때 발생한다.
