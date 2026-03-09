---
title: "[백준 11509] 풍선 맞추기 - JavaScript"
date: "2025-12-15"
category: "Dev"
---

https://www.acmicpc.net/problem/11509

![백준 11509](https://velog.velcdn.com/images/tngur0716/post/d205c923-e868-4ed9-9c1c-af9c8df19d36/image.png)

#### 문제 아이디어

풍선배열을 뒤에서 부터 순회해서 이전 요소에 1을 더한 것과 같을시에는 화살 배열의 높이를 1 높히고 아닐시에는 현재 요소의 높이의 화살을 추가하는 식으로 구현해야 겠다고 생각했다. 

---

#### 수정코드 

```js
let fs = require('fs')
let input = fs.readFileSync('/dev/stdin').toString().split("\n")

let n = Number(input[0])
let arr = input[1].split(" ").map(Number)

let ans = 0

let arrows = new Array(1000001).fill(0)

for (let x of arr) {
  if (arrows[x] > 0) {
    arrows[x] --
    arrows[x-1] ++
  }
  else {
    arrows[x-1] ++
    ans ++
  }
}
console.log(ans)
```

---

#### 코드해석

```js
let arrows = new Array(1000001).fill(0)
```

- 화살의 높이를 담아둘 배열을 미리 정해진 크기의 배열로 만들어둔다. 배열을 돌면서 화살이 있는 경우 (0보다 큰경우) 해당 높이의 화살을 없애고 1 낮아진 높이의 화살배열 요소를 1증가 시킨다.

---

#### 어려웠던 점

처음 코드를 보면 화살의 높이를 담아둘 배열 설정을 잘못 해서 화살의 높이가 배열에 중복으로 계속 들어가 `includes()` 함수까지 사용하게 되어 시간초과가 되었던 것 같다. 
