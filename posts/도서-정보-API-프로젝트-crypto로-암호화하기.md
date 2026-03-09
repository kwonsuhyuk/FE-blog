---
title: "[도서 정보 API 프로젝트] crypto 모듈로 비밀번호 암호화하기"
date: "2025-11-08"
category: "Project"
---

### 기존 회원가입 비밀번호 DB 저장 방식

기존 회원가입 에서는 `req.body` 에서 password 를 받아 password를 받아 그래도 mariadb 에 저장 하였다 .

기존방식
```js 
const join = (req, res) => {
	const { email, password } = req.body;
  	let sql = "INSERT INTO users (email, password) VALUES (?,?)";
   	let values = [email, password];
    
  	conn.query(sql, values, (err, results) => {
    	if (err) {
        	return res.status(StatusCodes.BAD_REQUEST).end()
        }
		return res.status(StatusCodes.CREATED).json(results);
    }
}
```

DB 조회 결과

- password 가 그대로 저장됨.

---

### 문제점 

회원의 비밀번호가 그대로 노출되어서 보안 상 좋지 않다. 


### 해결방법

> crypto 모듈로 암호화 해서 저장하기.

- 설치

```bash
$ npm i crypto 
```

- 사용하기

1. 크립토 모듈 불러오기
```js
const crypto = require("crypto");

```

2. salt 만들기
```js
const salt = crypto.randomBytes(10).toString("base64");
```
> salt 란?
-
데이터 보안을 강화하는 요소로, 임의의 데이터를 원본 비밀번호에 추가하여 해시 함수를 통해 암호화 하는 과정에서 사용됨. 단방향 암호화에서 사용되며, 항상 동일한 값이 생성되는 것을 방지.
출처 : https://st-lab.tistory.com/100

> base64 란?
-
바이너리 데이터를 안전하고 효율적으로 텍스트 형태로 변환할 수 있는 유용한 방법.
바이너리 데이터 전송 등에서 문자 코드에 영향을 받지 않는 문자열로 데이터 변환시 주로 사용
ex ) 이메일 전송, 웹 데이터 인코딩. 
출처 : https://effectivesquid.tistory.com/entry/Base64-%EC%9D%B8%EC%BD%94%EB%94%A9%EC%9D%B4%EB%9E%80

3. 암호화 하기
```js
const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");
```

- `.pbkdf2Sync(비밀번호, salt 값, 해시 적용 반복횟수, 키의 길이, 해시 알고리즘) `


### 주의할점 !
salt 를 이용한 단방향 암호화 이기 때문에 로그인 할때 비밀번호 비교 시 문제가 생김!

#### 해결방법
```js
 let sql = "INSERT INTO users (email, password , salt) VALUES (?,?,?)";
 let values = [email, hashPassword, salt];

 conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
```

DB 에 salt를 같이 저장해서 salt를 이용해서 로그인시 비밀번호를 암호화시켜 비교하는 방식으로 구현하였다.

```js
// 로그인 할때 비밀번호 확인하는 로직
...

const loginUser = results[0];

// salt 값 꺼내서 날 것으로 들어온 비밀번호를 암호화
const hashPassword = crypto
	.pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
	.toString("base64");

...

```

---

### 결론

`crypto` 모듈을 통해서 보안을 강화할 수 있고, 암호화시 어떻게 비교할 것인지 등 고려해야 할점이 많다. 
양방향 암호화 등 더욱 쉽게 암호화 복호화 할 수 있는 방법에 대해서 알아봐야겠다.
