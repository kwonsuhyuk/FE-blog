---
title: "BFS와 DFS 알고리즘"

date: "2026-03-17"

category: "Dev"
---

코딩테스트에서 가장 자주 나오는 알고리즘 중 하나인 BFS 와 DFS에 대해서 간단하게 원리와 구현 방법에 대해서 기록하려고 한다.

## DFS란 ?

DFS(Depth First Search)는 깊이 우선 탐색 알고리즘이다.  
현재 위치에서 갈 수 있는 경로를 따라 **최대한 깊이 들어간 후**, 더 이상 갈 수 없으면 이전으로 돌아와 다른 경로를 탐색하는 방식이다.

<img width="703" height="365" alt="Image" src="https://github.com/user-attachments/assets/cf90ccfb-5f3d-4aca-84c1-5f5df87653aa" />

이 탐색 방식은 다음과 같은 특징을 가진다.

- 한 방향으로 끝까지 탐색한다
- 더 이상 진행할 수 없으면 되돌아온다 (Backtracking 구조)
- 재귀 함수로 자연스럽게 구현할 수 있다

이러한 특성 때문에 DFS는 다음과 같은 문제에서 자주 사용된다.

- 그래프 전체 탐색
- 연결 요소(덩어리) 탐색
- 2차원 격자 탐색
- 모든 경우의 수 생성 (순열, 조합)
- 백트래킹 문제

---

## DFS 기본 구조

DFS를 구현하기 위해 필요한 기본 요소는 다음과 같다.

### 1) 그래프 (이동 정보)

어디로 이동할 수 있는지에 대한 정보

### 2) 방문 배열 (visited)

이미 방문한 노드를 다시 방문하지 않기 위해 사용

### 3) DFS 함수 (재귀)

기본 형태는 다음과 같다.

```python
def dfs(x):
    visited[x] = True

    for nx in graph[x]:
        if not visited[nx]:
            dfs(nx)
            
dfs(1)
```



##  DFS 사용하는 각 케이스 

### 1. 그래프 트리에서 단순 탐색시에

이 경우에는 “최단거리”가 중요한 게 아니라 **연결된 애들을 전부 방문하는 것 자체**가 목적 -> 구현을 간단하게 할수 있음

```python
graph = [
    [],
    [2, 3],
    [1, 4],
    [1],
    [2]
]

visited = [False] * 5

def dfs(x):
  visited[x] = True
  print(x, end=' ')
  
  for nx in graph[x]:
    if not visited[nx]:
      dfs(nx)
      
dfs(1)
```

## **여기서 중요한 포인트**

- graph[x]는 현재 노드와 연결된 다음 노드들
- visited[x] = True를 안 하면 무한 반복 가능
- 재귀가 “들어갔다가 다시 돌아오는 구조”를 자동으로 해줌



### 2. 연결 요소 개수 세기

네트 워크 개수, 친구 그룹수 , 덩어리 개수 등등 덩어리 개수 세기 문제에서 출제 

```python
graph = [
    [],
    [2],
    [1],
    [4],
    [3]
]

visited = [False] * 5

def dfs(x):
  visited[x] =True
  for nx in graph[x]:
    if not visited[nx]:
      dfs(nx)
count = 0
for i in range(1,5):
  if not visited[i]:
    dfs(i)
    count += 1
    
print(count)
```

## **어떻게 해석하냐?**

- 1에서 DFS 시작 → 1,2 방문
- 2는 이미 방문
- 3에서 DFS 시작 → 3,4 방문
- 그래서 총 2개 그룹



### 3. 2차원 격자에서 덩어리 찾기

섬의 개수 단지 번호 붙이기 그림 개수, 등등 에서 사용

```python
grid = [
    [1, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 0]
]

n = len(grid)
m = len(grid[0])

dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

def dfs(x, y):
    if x < 0 or x >= n or y < 0 or y >= m:
        return

    if grid[x][y] == 0:
        return

    grid[x][y] = 0

    for i in range(4):
        dfs(x + dx[i], y + dy[i])

count = 0
for i in range(n):
  for j in range(m):
    if grid[i][j] == 1:
      dfs(i,j)
      count +=1
 
print(count)
```

### 4.  모든 경우의 수를 만들어봐야 할때

가능한 모든 수열만들기, 조합 순열, 부분집합, 가능한 케이스 전부 탐색 등에서 사용한다.

```python
# 길이 3 수열 만들기

def dfs(path):
  if len(path) == 3:
    print(path)
    return
  
  for i in range(1,4):
    dfs(path + [i])
    
dfs([])
```

## **이 코드가 의미하는 것**

- 현재까지 고른 값들이 path
- 길이가 3이 되면 하나의 경우 완성
- 아니면 다음 숫자를 붙여서 계속 탐색



### 5. **중복 없이 선택해야 하는 순열/조합**

서로 다른 숫자 뽑기, 한 번 쓴 원소는 다시 못 씀 등등에서 사용한다.

현재 단계에서 어떤 원소를 골랐는지 기억해야 하고, 재귀가 끝나면 다시 되돌려서 다른 선택을 해야 하는데 DFS+ 상태관리가 필요하다. 

-> 백트래킹 구조가 필요하다.



```python
n = 3
visited = [False] * (n+1)

def dfs(path):
  if len(path) == 3:
    print(path)
    return
  
  for i in range(1, n+1):
    if not visited[i]:
      visited[i] = True
      dfs(path+[i])
      visited[i] = False
```

- 들어갈 때 사용 표시
- 돌아올 때 사용 취소

-> **백트래킹**



### 6. 백트래킹 문제

문제를 풀다 보면, 어떤 선택을 했다가 나중에 보니 조건에 안 맞는 경우가 있는데 그럼 더 내려갈 필요 없이 돌아와야 한다.

즉:

- 선택
- 가능하면 진행
- 불가능하면 중단
- 되돌아와서 다른 선택

이 구조 자체가 DFS + 가지치기이다.

```python
# 1, 2, 3을 사용해서 중복 없이 길이 3인 수열을 만드는 코드
visited = [False] * 4

def dfs(path):
    if len(path) == 3:
        print(path)
        return

    for i in range(1, 4):
        if visited[i]:
            continue

        visited[i] = True
        path.append(i)

        dfs(path)

        path.pop()
        visited[i] = False

dfs([])
```

- DFS는 일단 다 들어가보는 탐색
- 백트래킹은 들어가다가 안 되는 길은 중간에 끊는 탐색



DFS가 나오는 대표 케이스는 크게 4부류로 보면 된다.

1. **연결된 걸 전부 방문할 때**
   - 그래프 탐색, 연결 요소, 섬 개수
2. **모든 경우를 만들어볼 때**
   - 순열, 조합, 부분집합
3. **선택했다가 되돌려야 할 때**
   - 백트래킹, N-Queen, 스도쿠
4. **트리/경로를 깊게 내려가며 정보 계산할 때**
   - 부모 찾기, 서브트리, 경로 탐색

---

## BFS란 무엇인가

BFS(Breadth First Search)는 너비 우선 탐색 알고리즘이다.  
현재 위치에서 가까운 노드부터 차례대로 탐색해 나가는 방식이다.

<img width="708" height="366" alt="Image" src="https://github.com/user-attachments/assets/7c2d3f0c-76bc-40ad-9c50-09fa4a0e7dbe" />

DFS가 한 방향으로 끝까지 내려가는 방식이라면,  
BFS는 같은 거리의 노드를 먼저 모두 탐색한 후 다음 단계로 넘어간다.

이 탐색 방식은 다음과 같은 특징을 가진다.

- 가까운 노드부터 탐색한다
- 레벨(거리) 단위로 탐색이 진행된다
- 큐(queue) 자료구조를 사용한다
- 가중치가 없는 그래프에서 최단거리를 보장한다

---

## BFS의 핵심 구조

BFS는 큐(Queue)를 사용하여 구현한다.

```python
from collections import deque

def bfs(start):
    q = deque([start])
    visited[start] = True

    while q:
        x = q.popleft()

        for nx in graph[x]:
            if not visited[nx]:
                visited[nx] = True
                q.append(nx)
```

## BFS 사용하는 각 케이스 

### 1. 그래프 탐색

특정 노드에서 시작해서 연결된 모든 노드를 방문 한다. 

```python
from collections import deque

# graph는 "인접 리스트" 형태의 그래프이다.
# graph[i]에는 i번 노드와 연결된 노드들이 들어 있다.
#
# 예를 들어:
# graph[1] = [2, 3]
# => 1번 노드는 2번, 3번 노드와 연결되어 있다는 뜻
graph = [
    [],         # 0번 인덱스는 사용하지 않음
    [2, 3],     # 1번 노드 -> 2, 3
    [1, 3, 4],  # 2번 노드 -> 1, 3, 4
    [1, 2],     # 3번 노드 -> 1, 2
    [2]         # 4번 노드 -> 2
]

# visited[i]는 i번 노드를 방문했는지 여부를 저장한다.
# 처음에는 아무 노드도 방문하지 않았으므로 전부 False
visited = [False] * 5


def bfs(start):
    # BFS는 큐(Queue)를 사용한다.
    # deque([start])는 시작 노드를 큐에 넣고 탐색을 시작하겠다는 뜻이다.
    q = deque([start])

    # 시작 노드는 큐에 넣는 순간 방문 처리한다.
    # 이유:
    # 나중에 같은 노드가 중복해서 큐에 들어가는 것을 방지하기 위해서다.
    visited[start] = True

    # 큐에 탐색할 노드가 남아 있는 동안 반복한다.
    while q:
        # 큐의 맨 앞 노드를 꺼낸다.
        # BFS는 먼저 들어간 노드부터 처리한다. (FIFO)
        x = q.popleft()

        # 현재 꺼낸 노드를 출력
        print(x, end=' ')

        # 현재 노드 x와 연결된 모든 인접 노드를 확인한다.
        for nx in graph[x]:
            # 아직 방문하지 않은 노드라면
            if not visited[nx]:
                # 방문 처리 먼저 하고
                visited[nx] = True

                # 큐에 넣는다.
                # 이렇게 하면 현재 노드와 "한 단계 더 떨어진" 노드들이
                # 차례대로 뒤에 쌓이게 된다.
                q.append(nx)


bfs(1)
```



### 2. 최단 거리 문제

가중치가 없는 그래프에서 최소 이동 횟수 구하기 에서 주로 사용한다. 

- BFS는 거리 순으로 탐색
- 처음 도착한 경로가 최단거리

```python
from collections import deque

graph = [
    [],
    [2, 3],
    [1, 4],
    [1, 4],
    [2, 3]
]

def bfs(start):
    # distance[i] = 시작점에서 i번 노드까지의 최단거리
    # 아직 방문하지 않은 노드는 -1로 표시
    distance = [-1] * 5

    # 시작점의 거리는 0
    distance[start] = 0

    q = deque([start])

    while q:
        x = q.popleft()

        for nx in graph[x]:
            # 아직 방문하지 않았다면
            if distance[nx] == -1:
                # 현재 노드까지 거리 + 1
                distance[nx] = distance[x] + 1
                q.append(nx)

    return distance

print(bfs(1))
```



### **3. 2차원 배열 BFS**

2차원 배열도 결국 그래프처럼 생각할 수 있다.

예를 들어 (x, y)라는 한 칸이 하나의 노드이고,

상하좌우로 갈 수 있다면 그 칸들과 연결된 그래프라고 볼 수 있다.

이때 BFS는 시작 칸에서 가까운 칸부터 퍼져나가므로

도착점에 처음 도달했을 때가 최단거리다.

```python
from collections import deque

grid = [
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1]
]

n = len(grid)
m = len(grid[0])

# 상, 하, 좌, 우 이동
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

def bfs(x, y):
    q = deque([(x, y)])

    while q:
        x, y = q.popleft()

        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]

            # 배열 범위를 벗어나면 무시
            if nx < 0 or nx >= n or ny < 0 or ny >= m:
                continue

            # 0은 벽이므로 이동 불가
            if grid[nx][ny] == 0:
                continue

            # 1이면 아직 방문하지 않은 길
            if grid[nx][ny] == 1:
                # 현재 칸 값 + 1을 저장해서 거리 기록
                grid[nx][ny] = grid[x][y] + 1
                q.append((nx, ny))

    return grid[n-1][m-1]

print(bfs(0, 0))
```

### 5. 다중 시작점 BFS

문제에서 이런 느낌이면 다중 시작점 BFS다.

- 여러 곳에서 동시에 퍼진다
- 여러 출발점이 있다
- 하루가 지날 때마다 전염된다
- 익은 토마토가 주변으로 익게 만든다
- 불이 여러 곳에서 동시에 번진다

만약 시작점이 여러 개인데 하나씩 따로 BFS를 돌리면

실제로는 동시에 퍼져야 할 상황을 올바르게 표현하지 못한다.

그래서 **처음부터 모든 시작점을 큐에 넣고 한 번에 BFS**를 돌린다.

그러면 큐의 특성상 같은 시간대의 칸들이 함께 퍼져나가는 효과가 생긴다.

```python
from collections import deque

grid = [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 1]
]

n = len(grid)
m = len(grid[0])

q = deque()

# 처음부터 시작점들을 전부 큐에 넣는다
for i in range(n):
    for j in range(m):
        if grid[i][j] == 1:
            q.append((i, j))

dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

while q:
    x, y = q.popleft()

    for i in range(4):
        nx = x + dx[i]
        ny = y + dy[i]

        if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == 0:
            grid[nx][ny] = grid[x][y] + 1
            q.append((nx, ny))
```

## 마무리 하며

### DFS vs BFS 정리 및 코딩테스트에서의 활용 포인트

## 1. DFS와 BFS 개요

그래프 탐색에서 가장 기본이 되는 두 가지 알고리즘은 DFS(Depth First Search)와 BFS(Breadth First Search)이다.

- DFS: 한 방향으로 끝까지 탐색 후 되돌아오는 방식
- BFS: 가까운 노드부터 순차적으로 탐색하는 방식

두 알고리즘 모두 모든 노드를 탐색할 수 있지만, **탐색 순서와 활용 목적이 다르다**는 점이 중요하다.

---

## 2. DFS vs BFS 핵심 차이

| 구분        | DFS             | BFS             |
| ----------- | --------------- | --------------- |
| 탐색 방식   | 깊이 우선       | 너비 우선       |
| 자료구조    | 재귀 / 스택     | 큐              |
| 탐색 순서   | 한 방향 끝까지  | 가까운 노드부터 |
| 최단거리    | 보장 ❌          | 보장 ⭕          |
| 구현 난이도 | 간단 (재귀)     | 큐 사용 필요    |
| 메모리 사용 | 상대적으로 적음 | 상대적으로 많음 |

---

## 3. 언제 DFS를 사용해야 하는가

다음과 같은 상황에서는 DFS를 사용하는 것이 자연스럽다.

### 1) 연결된 영역 탐색

- 연결 요소 개수
- 섬 개수
- 단지 번호

→ DFS 한 번 = 하나의 덩어리 처리

---

### 2) 모든 경우의 수 탐색

- 순열
- 조합
- 부분집합

→ 선택 → 재귀 → 되돌아오기 구조

---

### 3) 백트래킹 문제

- N-Queen
- 스도쿠
- 연산자 끼워넣기

→ 조건에 맞지 않으면 중간에 탐색 중단

---

### 4) 트리 탐색

- 부모 찾기
- 깊이 계산
- 서브트리

---

## 4. 언제 BFS를 사용해야 하는가

다음과 같은 상황에서는 BFS가 정답이다.

### 1) 최단거리 문제

- 최소 이동 횟수
- 가장 빠른 경로

→ BFS는 거리 순으로 탐색하기 때문에 최단거리 보장

---

### 2) 2차원 격자 탐색 (최단거리)

- 미로 탐색
- 게임 맵 최단거리

---

### 3) 확산 / 전파 문제

- 토마토
- 불
- 바이러스

→ 다중 시작점 BFS

---

### 4) 레벨 단위 탐색

- 단계별 탐색이 필요한 경우

---

## 5. DFS vs BFS 선택 기준

문제를 보고 다음 기준으로 판단하면 된다.

### DFS를 선택해야 하는 경우

- "모든 경우를 탐색"해야 한다
- "가능한 경우 전부 출력"
- "조건을 만족하는 경우 찾기"
- "연결된 덩어리 개수"

---

### BFS를 선택해야 하는 경우

- "최소 횟수", "최단 거리"
- "가장 빠르게 도달"
- "동시에 퍼짐"
- "레벨 순 탐색"

---

## 코딩테스트에서 자주 하는 실수 (DFS)

### 1) visited 처리 안 함

```python
visited[x] = True
```



### **2) 재귀 깊이 초과**

```python
import sys
sys.setrecursionlimit(10**6)
```



### **3) 백트래킹에서 복구 안 함**

```python
path.append(x)
dfs(...)
path.pop()
```



## **코딩테스트에서 자주 하는 실수 (BFS)** 

### **1) visited를 늦게 처리함**

```python
visited[nx] = True
q.append(nx)
```

BFS는 **큐에 넣을 때 바로 방문 처리**해야 중복 삽입을 막을 수 있다.

### **2) 최단거리 문제인데 visited만 씀**

```python
distance[nx] = distance[x] + 1
```

최단거리를 구해야 하면 visited만 쓰지 말고 distance 배열도 같이 써야 한다.

### **3) 2차원 배열 범위 체크 안 함**

```python
if nx < 0 or nx >= n or ny < 0 or ny >= m:
    continue
```



## **실전에서 빠르게 판단하는 방법**

- 최단거리면 BFS
- 모든 경우의 수면 DFS
- 연결된 덩어리 개수면 DFS / BFS 둘 다 가능
- 동시에 퍼지는 문제면 BFS



bfs, dfs 는 코딩테스트에서 반드시 나오는 유형중 하나이기에 python 을 통해서 간단하게 정리해봤다!

![Image](https://github.com/user-attachments/assets/e7697fa8-f160-4fd6-af99-3d8b24781a31)

