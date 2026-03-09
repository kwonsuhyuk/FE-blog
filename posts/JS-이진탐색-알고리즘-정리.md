---
title: "JavaScript 이진 탐색(Binary Search)과 파라메트릭 서치"
date: "2026-02-28"
category: "Dev"
---

## 이진 탐색 (Binary Search)
정렬되어 있는 리스트에서 탐색 범위를 절반씩 좁혀가며 데이터를 탐색하는 알고리즘입니다. 시간 복잡도는 **O(logN)**으로 매우 효율적입니다.

### 반복문을 이용한 구현
```js 
function binarySearch(arr, target, left, right) {
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] > target) right = mid - 1;
    else left = mid + 1;
  }
  return -1;
}
```

---

## 정렬된 배열에서 특정 원소의 개수 구하기
`lowerBound`와 `upperBound` 함수를 사용하여 특정 값의 범위를 찾을 수 있습니다.

```js
function countByRange(arr, leftValue, rightValue) {
  let rightIndex = upperBound(arr, rightValue, 0, arr.length);
  let leftIndex = lowerBound(arr, leftValue, 0, arr.length);
  return rightIndex - leftIndex;
}
```

---

## 파라메트릭 서치 (Parametric Search)
최적화 문제를 결정 문제('Yes' or 'No')로 바꾸어 해결하는 기법입니다. 특정한 조건을 만족하는 가장 알맞은 값을 찾을 때 이진 탐색을 응용하여 해결합니다.
