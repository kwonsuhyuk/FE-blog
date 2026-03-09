---
title: "JavaScript 코딩테스트 핵심 문법 정리"
date: "2025-09-04"
category: "Dev"
---

## 출력시간 단축하기 
여러 출력 결과를 한줄에 하나씩 출력할때 매번 console.log() 하지 않고 , **_하나의 문자열에 결과 저장해서 한꺼번에 출력_**하기
```js
let ans = '';

for (let i=0; i<= 10 ; i++) {
	ans += i + '\n';
}

console.log(ans);
```

## 입력 데이터가 텍스트 파일일시, fs모듈

파일 전체를 fs 모듈로 읽어와서 처리
```js
let fs = require('fs')
let input = fs.readFileSync('input.txt')
.toString()
.split('\n')
```
- input.txt 
123
456
789 1111

- 출력
['123', '456', '789 1111']

## 한줄 식 입력 받아 처리, readline모듈
```js
const rl = require('readline').createInterface({
	input:process.stdin,
  	output:process.stdout
})

let input = []

rl.on('line' , function (line) {
	input.push(line)
}).on('close', function () {
	console.log(input);
  	process.exit();
})
```

## reduce()
배열의 모든 원소에 대해서 특정한 연산을 순차적으로 적용시에 사용

- 배열의 각 요소에 대해 _**reducer 함수 실행후 하나의 결과**_ 반환
>reducer : (accumulator, currentValue) => 반환값

- 배열의 각 원소를 확인하여 각 원소는 currentValue에 저장
- 반환 값은 그 이후의 원소에 대해 accumulator에 저장.

```js
let data = [3,2,5,4,6]

// minValue 구하기 
let minValue = data.reduce((a,b) => Math.min(a,b));

// 합계 구하기
let sum = data.reduce((a,b) => a+b));
```

## 배열 초기화 하기 

```js
// 길이가 5이고 모든 원소의 값이 0 인 배열 초기화
let arr = new Array(5).fill(0)
```
