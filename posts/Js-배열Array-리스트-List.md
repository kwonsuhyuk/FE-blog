---
title: "JavaScript 배열(Array)과 리스트(List) 기초"
date: "2025-08-30"
category: "Dev"
---

# 자료구조란 ?
- 다수의 자료를 담기 위한 구조
- 데이터 수가 많아질수록 효율적인 자료구조가 필요

## 배열(Array)
- index가 존재하며, 인덱스는 0부터 시작
- 특정한 인덱스에 직접적 접근 가능

> 배열의 특징

- 배열의 공간은 연속적으로 할당된다. 
- JS 의 배열 자료형은 **동적 배열** 이다.
	- 배열생성 이후에도 배열의 크기를 임의 변경 가능
- `push()` 메서드를 통해 배열가장 뒤쪽에 새로운 원소 추가 가능

**장점**
- 캐시 히트 가능성이 높으며, 조회가 빠름

**단점**
- 데이터의 추가 및 삭제에 한계

### Js 에서 배열 사용

```js
let arr = []

arr.push(1);
arr.push(2);
```
### JS 배열 초기화 

1. 원하는 값 직접 입력하여 초기화
```js
let arr1 = [1,2,3,4,5];
```

2. 하나의 값으로 초기화
```js
let arr2 = Array.from({length:5}, ()=>7);
// [7,7,7,7,7]
```

### 크기가 N X M 인 2차원 리스틉(배열) 만들기


1. 직접 입력하여 만들기
```js
let arr3 = [[0,1,2,3], [4,5,6,7]]
```

2. 한줄로 만들기 (ES6 이상에서 지원)
```js
let arr4 = Array.from(Array(4), () => new Array(5))
//[
  [undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined]
]
```

### JS 배열의 대표적 메서드
- `concat()` : 여러 개의 배열을 이어 붙여서 합친 결과 반환
```js
let arr = arr1.concat(arr2, [11,22], [33])
// [1,2,3,4,5,7,7,7,7,7,11,22,33]
```
- `slice(left, right)` : 특정 구간의 원소를 꺼낸 배열 반환
	-  right 포함 x
```js
let arr = [1,2,3,4,5];
let res = arr.slice(2,4);

// [3,4]
```

- `indexOf()` : 특정한 값을 가지는 원소의 첫째 인덱스 반환
	- 해당 원소 없을 경우 -1 반환
```js
let arr = [1,2,3,3,4,5];
console.log(arr.indexOf(2))
// 1

console.log(arr.indexOf(3))
// 2

console.log(arr.indexOf(10))
// -1

```

---

## 연결리스트 (Linked List)
- 메인 메모리상에서 주소가 연속적이지 x
- 배열과 다르게 크기가 정해져 있지 않고, 동적으로 변경 가능
- 각 노드가 한줄로 연결되어 있는 자료 구조.
- 각 노드는 (데이터, 포인터) 형태를 가짐

_**포인터**_
- 다음 노드의 메모리 주소를 가리키는 목적으로 사용
- 각 노드의 포인터는 다음 혹은 이전 노드를 가리킨다. 
	=>** 연결성**

**장점**
- pointer를 통해서 다음 데이터의 위치를 가리킨다. -> 삭제 삽입 쉬움

**단점**
- 데이터 검색 속도가 느림
---
