---
title: "JavaScript로 구현하는 큐(Queue) 자료구조"
date: "2025-10-03"
category: "Dev"
---

## 큐(Queue)
**먼저 삽입된 데이터가 먼저 추출되는** 자료구조 
ex ) 게임 대기큐 -> 먼저 대기한 사람이 먼저 게임에 매칭됨

![Queue](https://velog.velcdn.com/images/tngur0716/post/bdc8a1a0-985b-45c1-88d7-65be0508b2ff/image.png)

## 연결리스트로 큐 구현하기
- 삽입과 삭제에 있어서 O(1) 보장 할 수 있다. 
- 연결리스트로 구현시 머리(head) 꼬리 (tail) 두개의 포인터를 가진다. 
- _**머리(head)**_ : 남아있는 원소 중 가장 먼저 들어 온 데이터를 가리키는 포인터 
- _**꼬리(tail)**_ : 남아있는 원소 중 가장 마지막에 들어 온 데이터를 가리키는 포인터


-> _**삽입시**_ 꼬리 위치에 데이터를 넣는다. 
-> _**삭제시**_ 에는 머리 위치에서 데이터를 꺼낸다.


## 큐 동작 속도 : 배열 vs 연결 리스트
- 연결 리스트를 사용할 때 수행 시간 관점에서 효율적이다. 
- JS 에서는 _**Dictionary 자료형**_을 이용하여 큐를 구현.

```js 
class Queue {
	constructor() {
    	this.items = [];
      	this.headIndex = 0;
      	this.tailIndex = 0;
    }
  	enqueue(item) {
		this.items[this.tailIndex] = item;
	    this.tailIndex++;
      
	}
  	dequeue() {
		const item = this.items[this.headIndex];
      	delete this.items[this.headIndex];
      	this.headIndex++;
      	return item;
	}
  	peek() {
    	return this.items[this.headIndex];
    }
  	getLength() {
    	return this.tailIndex - this.headIndex;
    }

}
```
