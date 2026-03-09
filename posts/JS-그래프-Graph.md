---
title: "JavaScript 그래프(Graph) 자료구조 기초"
date: "2025-10-15"
category: "Dev"
---

## 그래프
- 사물을 정점 과 간선으로 나타내기 위한 도구
- 두가지 방식으로 구현
1. **인접행렬** : 2차원 배열을 사용하는 방식
2. **인접리스트** : 연결 리스트를 이용하는 방식
    
---

### 인접행렬    
![Adjacency Matrix](https://velog.velcdn.com/images/tngur0716/post/9af140c7-db86-42d7-aaa4-35ce7fb851e9/image.png)

- O(V^2)의 공간 요구
- 공간 효율성이 떨어지지만 , 두 노드의 연결 여부를 O(1) 에 확인 가능


#### 무방향 무가중치 그래프
- 모든 간선이 방향성 가지는 그래프 : 무방향 그래프
- 모든 간선에 가중치가 없는 그래프 : 무가중치 그래프
![Undirected Graph](https://velog.velcdn.com/images/tngur0716/post/ee89a612-a715-4eb9-8a8d-1b9152393e2b/image.png)
-> 인접 행렬로 표시

#### 방향 가중치 그래프
- 모든 간선이 방향을 가지는 그래프 : 방향 그래프
- 모든 간선에 가중치가 있는 그래프 : 가중치 그래프
![Directed Graph](https://velog.velcdn.com/images/tngur0716/post/95546289-969c-4db6-a618-fe1222eb3885/image.png)
-> 인접 행렬로 표시

---

### 인접리스트

![Adjacency List](https://velog.velcdn.com/images/tngur0716/post/95a262c8-1d20-433b-bc32-6f5b084c5c7d/image.png)

- 그래프를 리스트로 표현
- O(V+E)의 공간 요구
- 공간 효율성이 우수하지만, 두 노드의 연결 여부 확인 위해 O(V)의 시간 필요

#### 무방향 무가중치 그래프
![Undirected List](https://velog.velcdn.com/images/tngur0716/post/15abe1f9-bf3a-435f-9ed0-6c351ede9be2/image.png)
-> 인접 리스트로 표시


#### 방향 가중치 그래프
 ![Directed List](https://velog.velcdn.com/images/tngur0716/post/4b9449c5-1882-41d3-a16d-293f3364c44b/image.png)
 
-> 인접 리스트로 표시

---

### 인접행렬 vs 인접 리스트
- 최단 경로 알고리즘 구현 시.
-> 각각 근처의 노드와 연결되어 있는 경우가 많으므로, 간선 개수가 적어 <u>_**인접리스트**_</u> 가 유리
