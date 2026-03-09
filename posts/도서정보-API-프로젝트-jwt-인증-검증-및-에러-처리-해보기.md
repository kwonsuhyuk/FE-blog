---
title: "[도서정보 API 프로젝트] JWT 인증 검증 구현 및 에러 핸들링"
date: "2025-11-28"
category: "Project"
---

![JWT Header](https://velog.velcdn.com/images/tngur0716/post/693521d8-6767-45f5-b72d-16e528ae65ed/image.png)

## JWT 를 이용한 회원 로그인 인증 방식

회원 로그인 을 진행할때 입력받은 email을 db에서 찾아서 해당 유저의 데이터가 있고 해당 유저의
비밀번호 (암호화해서 저장된 비밀번호 ) 와 입력받은 비밀번호를 암호화한것이 같다면 로그인을 진행을 했었었다.

그 기능에 추가적으로 유저가 로그인 시에 response의 헤더부분에 jwt를 통해서 인증방법을 추가하고자 한다.

```js
const token = jwt.sign(
  {
    id: loginUser.id,
    email: loginUser.email,
  },
  process.env.PRIVATE_KEY,
  {
    expiresIn: "5m",
    issuer: "suhyuk",
  }
);
// 토큰 쿠키에 담기
res.cookie("token", token, {
  httpOnly: true,
});
```

이렇게 로그인 성공시에 쿠키 부분에 토큰을 보내게 되면 
![Set-Cookie](https://velog.velcdn.com/images/tngur0716/post/203eb9ac-dcc4-4ac2-8603-b854254783df/image.png)

이렇게 Set-Cookie 부분에 jwt 토큰이 날라오게 되는데 오늘은 이 토큰을 이용해서 여러 API 의 인증 부분을 
구현하고 에러 처리까지 해볼 예정이다.

---

### 1. header 의 Authorization 속성으로 jwt 토큰 저장해주기

![Postman Auth](https://velog.velcdn.com/images/tngur0716/post/55a2ad16-230f-435e-8f5b-e81035abaf39/image.png)
postman으로 해당 api의 `Authorization` 속성에 로그인시 발급한 set-cookie 부분의 jwt 토큰을 
넣어준다. (api 테스트를 위한 임시 방법)

### 2. jwt 토큰 가져오고 검증하는 로직 생성
```js
function ensureAuthorization(req, res) {
  try {
    let receivedJwt = req.headers["authorization"];
    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

    return decodedJwt;
  } catch (error) {
    console.log(error);

    return error;
  }
}
```

request의 헤더에서 authorization 속성 (대소문자 구별x) 의 값을 가져와 검증한다. 
검증 성공시에는 `decodedJwt` 를 반환하고 오류가 날시에는 error를 캐치해서 return 한다.

### 3. controller에 적용하기 

```js
const addLike = (req, res) => {
  const book_id = req.params.id;
  let decodedJwt = ensureAuthorization(req, res);
  
     ...
     
```
jwt 검증 로직을 컨트롤러에 적용시킨다. 

---

> ### + jwt Errors
#### 1. TokenExpiredError
- JWT 토큰의 유효기간이 만료된 경우 발생하는 오류
#### 2. JsonWebTokenError
- JWT 토큰의 유효성 검증에 실패한 경우 발생하는 오류

위의 에러들을 핸들링하기 위해서 `instanceof`를 이용해서 error의 인스턴스를 확인후에 에러 핸들링을 해주었다.

```js
if (decodedJwt instanceof jwt.TokenExpiredError) {
  return res.status(StatusCodes.UNAUTHORIZED).json({
    message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요",
	});
  
} else if (decodedJwt instanceof jwt.JsonWebTokenError) {
  return res.status(StatusCodes.BAD_REQUEST).json({
    message: "잘못된 토큰입니다.",
	});
}else {

  // 에러가 없으므로 decode된 jwt토큰을 이용해서 query를 실행하는 로직
	
}
```

_**이렇게 에러 핸들링시 ,**_
 
1. 만료된 토큰을 사용시에 :
![Expired Error](https://velog.velcdn.com/images/tngur0716/post/57ae5872-2ceb-4ce7-9c97-dbafeedcd7b7/image.png)

2. 로그인시 발급받은 jwt 코드와 다를시 :
![Invalid Token](https://velog.velcdn.com/images/tngur0716/post/ca0c27af-c041-4083-b6a2-16c3d16ab3c6/image.png)

성공적으로 에러 핸들링을 할 수 있었다. 
