---
title: "JavaScript 화살표 함수에서 중괄호 사용 시 주의할 점"
date: "2025-12-30"
category: "Dev"
---


## 서론 
채팅 메시지 구현을 와중에 변수에 값이 계속 안들어와지는 오류가 났다. 처음 오류가 난 코드는 
```js
 const conversation = currentUser?.conversations.find((conversation) =>
	 {conversation.users.find((user) => user.id === receiver.receiverId)}
  );
```
와 같았는데 위의 코드로 계속 콘솔을 찍어보니 undefined 가 찍혔고 계속 오류난 부분을 찾다보니 find안의 콜백 함수에 {}가 들어 갔다는 것을 찾을 수 있었다. 위의 실수를 다시 하지 않기 위해 서 화살표 함수에서 중괄호 사용 여부와 반환값에 대해서 정리하려고 한다.

### 화살표 함수에 중괄호를 사용하는 경우

```js
const double = (num) => {
  return num * 2; // 명시적인 반환값이 있음
}

const getFirst = (arr) => {
  // 명시적인 반환값이 없으므로 undefined 반환
}

```
중괄호를 사용시에 함수 본문을 블록으로 만들어서 명시적인 반환값이 없을 시에는 `undefined` 를 반환한다.

### 화살표 함수에 중괄호를 사용하지 않는 경우
```js
const double = (num) => num * 2; // num * 2 결과값이 반환값

const getFirst = (arr) => arr[0]; // arr[0] 요소가 반환값

```
중괄호가 없을 시에는 함수 본문이 간결한 표현식으로 취급되어서 해당 표현식의 결과값이 함수의 반환값이 된다.

### 따라서,

해당 코드를 _**중괄호를 사용하면서 undefined 가 나오지 않도록 결과값을 반환하기 위해서는**_
```js
const conversation = currentUser?.conversations.find((conversation) => {
  return conversation.users.find((user) => user.id === receiver.receiverId);
});

```
이렇게 return 문을 사용하여야 한다.

_**return 문을 사용하지 않고 중괄호를 사용하지 않을 시에는**_
```js
const conversation = currentUser?.conversations.find((conversation) =>
    conversation.users.find((user) => user.id === receiver.receiverId)
);
```
이렇게 작성해주면 된다. 

대신 , 여러 줄의 식이 있거나 할 시에는 중괄호를 써서 여러줄의 식을 처리하고 마지막에 return 문을 이용해서 반환하는 것이 좋다.
