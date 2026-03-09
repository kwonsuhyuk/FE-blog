---
title: "JavaScript 함수 호출 f() vs 함수 참조 f의 차이"
date: "2025-12-25"
category: "Dev"
---

![Function Comparison](https://velog.velcdn.com/images/tngur0716/post/73f8b801-8662-43b9-8afe-b9efdf8ad3ee/image.png)

## 서론

코딩을 하면서 함수를 가져오는 부분에서 f() f 에 대해서 헷갈릴때가 많아서 두개의 차이점을 공부하는 김에 정리해보기로 했다. 

### 함수 호출 f()

`f()` 로 함수를 가져오면 <u>**함수를 즉시 실행**</u>한다는 의미이다. 함수의 결과값을 바로 얻거나 특정 작업을 바로 수행하고자 할때 사용할 수 있다. 

```js
function greet() {
  console.log("Hello, World!");
}

greet(); // "Hello, World!" 출력

```

---

### 함수 참조 f
`f` 로 함수를 가져게 되면 함수의 이름만을 사용해서 <u>**해당 함수를 참조**</u> 하는 것을 의미한다. 이 방식은 함수를 즉시 실행하는 것이 아니라, 함수를 값처럼 다루어 다른 함수의 인자로 전달하거나 변수에 할당 할 수 있다. 함수 참조는 이벤트 핸들러나 콜백으로 사용할 때 유용하게 사용 할 수 있다 .

```js
function greet() {
  console.log("Hello, World!");
}

const sayHello = greet; // 함수를 sayHello 변수에 참조
sayHello(); // "Hello, World!" 출력

```

- react 에서 이벤트 핸들러를 지정 시에 자주 사용됨.
```jsx
function App() {
  function handleClick() {
    console.log("Button clicked!");
  }

  return <button onClick={handleClick}>Click me</button>;
  // handleClick 함수 참조
}

```

`onClick={handleClick}`은 handleClick 함수를 참조하여, 버튼이 클릭될 때 해당 함수가 실행되도록 한다. 만약 `onClick={handleClick()}`처럼 작성했다면, 컴포넌트가 렌더링될 때 함수가 즉시 실행한다.
