---
title: "JavaScript로 구현하는 스택(Stack) 자료구조"
date: "2025-09-28"
category: "Dev"
---

## 스택 
- 먼저 들어온 데이터가 나중에 나가는 자료구조 
![Stack](https://velog.velcdn.com/images/tngur0716/post/5bc39315-5f72-45e7-a09d-7c8589276cbf/image.png)

### 스택의 연산

```js
let stack = []
```
1. 삽입 (Push) -> O(1)
```js 
stack.push(1)
stack.push(2)
stack.push(3)
```
2. 추출 (Pop) -> O(1)
```js 
console.log(stack.pop())
 // 3
```
3. 최상위 원소 확인 (Top) -> O(1)
4. isEmpty -> O(1)
5. 스택이 가득 차있는지 확인(isFull)
6. 스택에 있는 요소 수를 반환(getSize)

### 연결 리스트로 스택 구현
- 삽입과 삭제에 있어서 O(1) 을 보장 가능
- 머리(head)를 가리키는 하나의 포인터만 가진다. 
- 머리(head) 
	- 남아 있는 원소 중 가장 마지막에 들어 온 데이터를 가리키는 포인터
    
    -> _**삽입**_ 시 머리위치에 데이터를 넣는다.
    
  
    -> _**삭제**_ 시 머리위치에 데이터를 꺼낸다.
