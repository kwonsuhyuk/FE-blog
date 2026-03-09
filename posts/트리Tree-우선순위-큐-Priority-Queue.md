---
title: "트리(Tree)와 우선순위 큐(Priority Queue)의 이해"
date: "2025-10-09"
category: "Dev"
---

## 트리(Tree)
- 가계도와 같이 계층적인 구조를 표현할 때 사용 할 수 있는 자료구조
![Tree](https://velog.velcdn.com/images/tngur0716/post/2da59f51-6684-4879-b80f-83aa896d6929/image.png)

> 용어
---
- 루트노드 (root node) : 부모가 없는 최상위 노드
- 단말노드 (leaf node) : 자식이 없는 노드
- 트리에서는 부모와 자식 관계가 성립한다.
- 형제 관계 ![Siblings](https://velog.velcdn.com/images/tngur0716/post/01ea89c9-9666-48c2-a37a-8274bfa48e2e/image.png)
- 깊이 (depth) : 루트 노드에서의 길이 (length)
	(길이는 <u>출발 노드에서 목적지 노드까지 거쳐야 하는 간선의 수</u>)

### 이진 트리 (Binary Tree)
- 최대 2개의 자식을 가질 수 있는 트리
![Binary Tree](https://velog.velcdn.com/images/tngur0716/post/4a022a52-57c7-4c7d-ae2c-8bb1834ab5b6/image.png)

### + 완전이진 트리 
- 모든 노드가 왼쪽 자식부터 차근차근 채워진 트리.![Complete Binary Tree](https://velog.velcdn.com/images/tngur0716/post/84f330ec-3636-4f38-8132-54e8b2521dea/image.png)

---

## 우선 순위 큐 (Priority Queue)
- 우선 순위에 따라서 데이터를 추출하는 자료구조.
- 컴퓨터 운영체제 등에서 활용
- 일반적으로 **<u>힙(heap)을 이용해 구현</u>**함.

> 일반 적인 형태의 큐는 선형적인 구조를 가지지만, 
<u>**_우선 순위 큐는 이진 트리 구조를 사용_**</u>하는 것이 일반적이다.

### 힙 (heap)
- 원소들 중에서 최댓값 혹은 최솟값을 빠르게 찾아내는 자료구조.
- **최대 힙(max heap)** : 값이 큰 원소부터 추출한다. 
- **최소 힙(min heap)** : 값이 작은 원소부터 추출한다.
(원소의 삽입과 삭제에 O(logN)의 수행시간)

>힙의 특징
1. 완전 이진 트리 자료구조 따름
2. <u>우선순위가 높은 노드가 루트에 위치</u>


#### 최대 힙(Max Heap)
부모노드가 자식 노드 보다 값이 큰 완전 이진 트리 의미.![Max Heap](https://velog.velcdn.com/images/tngur0716/post/af2d1659-02f5-4923-aa89-dd2d1de5734d/image.png)
- 루트노드가 전체 트리에서 가장 큰 값을 가진다는 특징
- 값이 큰 데이터가 우선순위를 가짐

#### 최소 힙(Min Heap)
부모노드가 자식 노드 보다 값이 작은 완전 이진 트리 의미.
- 루트노드가 전체 트리에서 가장 작은 값을 가진다는 특징
- 값이 작은 데이터가 우선순위를 가짐

#### 최소 힙 구성 함수 : <u>**Heapify**</u>
- 부모로 거슬러 올라가며, 부모보다 자신이 더작은 경우에 위치를 교체한다. ( O(logN) )
![Heapify](https://velog.velcdn.com/images/tngur0716/post/fc06eabb-8272-4bbb-96f4-8521d2cc8cbc/image.png)

( js는 heap 라이브러리 제공하지 x)
