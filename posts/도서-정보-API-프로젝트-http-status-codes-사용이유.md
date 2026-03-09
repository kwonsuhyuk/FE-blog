---
title: "[도서 정보 API 프로젝트] http-status-codes 사용 이유"
date: "2025-11-03"
category: "Project"
---

### 기존 response에 응답코드를 넘겨주는 방식

예시
```js 

// 성공
return res.status(200).json(result)

// 실패
return res.status(400).end()
```
위와 같은 <u>하드코딩</u> 방식으로 response를 넘겨줬었다. 

---
### 기존 방식의 문제점
1. 개발시 실수로 다른 응답코드를 넘겨줄 시 프론트엔드부분에서 혼란이 생길 수 있다. 
2. 응답코드에 대해서 일일히 다 외우고 있지 않은 이상 코드해석을 할 시에 어려움이 있을 수 있다.(가독성 떨어짐)



---
### 해결방법

http-status-codes 모듈을 사용해서 위의 문제점을 해결할 수 있다.

- 설치
```bash 
$ npm install http-status-codes --save
```

- 사용
```js
const { StatusCodes } = require("http-status-codes");

	...
    

return res.status(StatusCodes.OK) // 200 성공

return res.status(StatusCodes.BAD_REQUEST) // 400 실패 

```


이외에도 다양한 상태 코드들이 있다 .
![Status Codes](https://velog.velcdn.com/images/tngur0716/post/ea282d43-c38a-48f1-8303-567d84dae754/image.png)

---
### 결론
`http-status-codes` 모듈을 사용해서 더욱 가독성있는 코드를 작성할 수 있고 , 
변수이용으로 개발시 실수 할수 있는 부분을 보완할 수 있다.

---
출처 : https://www.npmjs.com/package/http-status-codes
