---
title: "JavaScript 정렬 알고리즘 핵심 요약"
date: "2025-09-11"
category: "Dev"
---

## 선택정렬
> 매단계 에서 가장 작은 원소를 선택해 앞으로 보내는 정렬

- O(N^2) -> 비효율 적

#### 동작 방식 
1. 각 단계에서 가장 작은 원소를 선택
2. 현재 까지 처리 되지 않은 원소들 중 가장 앞의 원소와 위치 교체

---

## 버블 정렬
> 단순히 인접한 두 원소를 확인하여, 정렬이 안되어 있다면 위치를 변경

- O(N^2) -> 비효율 적

#### 동작 방식
1. 각 단계에서 인접한 두개의 원소 비교해 필요시 위치 변경
2. 첫째 둘째 비교, 둘째 셋째 비교, ...

-> 한번의 단계가 수행시 가장 큰 원소가 맨 뒤로 이동
-> 가장 큰 원소 제외하고 반복

---

## 삽입 정렬
> 각 숫자를 적절한 위치에 삽입하는 정렬 방식

- O(N^2) -> 비효율 적 ( 정렬된 배열에서는 매우 빨리 동작함 )

#### 동작 방식
1. 각 단계에서 현재 원소가 삽입될 위치를 찾는다.
2. 적절한 위치에 도달할 때까지 반복적으로 왼쪽으로 이동한다.

``` js
function insertionSort(arr){
	for (let i=1; i < arr.length; i++){
		for (let j=i; j>0; j--){
			if (arr[j] < arr[j-1]){
				// 스와프
				let temp = arr[j];
				arr[j] = arr[j-1];
				arr[j-1] = temp;
			} else {
				// 자기보다 작은 데이터를 만나면 멈춤
				break;
			}
		}
	}
}

```
---

## 병합 정렬
> 전형 적인 분할 정복 알고리즘 (divide and conquer)

- 큰 문제를 작은 문제로 쪼개어 해결
- 일반적으로 재귀함수 이용
- 최대 O(NlogN)

#### 동작 방식
1. 분할 
	- 정렬할 배열을 같은 크기의 부분 배열 2개로 분할.
2. 정복
	- 부분 배열을 정렬한다. 
3. 조합
	- 정렬된 부분 배열을 하나의 배열로 다시 병합한다. 

``` js
// 병합 정렬
let arr = [2, 53, 9, 1, 7, 5, 5, 3, 23, 12, 78, 32, 52];
sorted = [];

function merge(arr, left, mid, right) {
  let i = left;
  let j = mid + 1;
  let k = left;

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      sorted[k++] = arr[i++];
    } else {
      sorted[k++] = arr[j++];
    }
  }

  // 왼쪽 배열 정리 완료
  if (i > mid) {

    for (; j <= right; j++) {
      sorted[k++] = arr[j];      
    }
  } else {
    // 오른쪽 배열 정리 완료
    for (; i <= mid; i++) {
      sorted[k++] = arr[i];
      
    }
  }
  // 정렬된 배열 원본 배열에 반영
  for (let x = left; x <= right; x++) {
    arr[x] = sorted[x];
  }

}

function mergeSort(arr, left, right) {
  if (left < right) {
    let mid = parseInt((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
}

mergeSort(arr, 0, arr.length);
```

## Js 정렬 라이브러리
> sort() 함수 

- 최대 O(NlogN)
```js 
arr.sort(compareFunction)
```

#### compareFunction 
- 정렬 기준을 정해주는 함수 
- 두개의 원소 a,b 입력 받음
	- 반환값 0보다 작음 -> a 가 우선 순위가 높아, 앞에 위치
    - 반환값 0보다 큼 -> b 가 우선 순위가 높아, 앞에 위치
    - 반환값 0 -> a,b 순서 변경 x
- 정렬 기준 함수 사용 하지 않으면 각 원소는 문자열로 취급됨.


##### 오름차순 정렬 코드 
``` js
function compare(a,b) {
	return a-b;
}

arr.sort(compare)


또는

arr.sort(function(a,b) {return a-b;})
console.log(arr)
// [1,2,3,5,7,8,9,15,21]
```

##### 객체 내림차순 정렬 
```js
let arr = [ {name: "홍길동", score:90}, {name:"김철수", score:85} ]

function compare(a,b) {
	return b.score -a.score
}

arr.sort(compare)
```
