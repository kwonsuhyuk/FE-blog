---
title: "쿠키, 세션, 그리고 JWT을 이용한 인증 방식"
date: "2025-10-21"
category: "Dev"
---

## 로그인 세션

### 인증과 인가 

> 인증(=로그인)

- Authentication 

> 인가

- Authorization 
- 인증후에 페이지 접근 권한 있는지

----

### 쿠키 vs 세션

> 쿠키

- 웹에서 서버와 클라이언트가 주고받는 데이터 중 하나 
- 웹서버가 생성해서 브라우저가 메모리에 저장 후 다음에 같은 웹서버 방문시 쿠키로 요청

- 장점 :  

  - 서버가 저장 x -> 서버 저장 공간 사용 X,

  - stateless -> RESTful

- 단점 :

  - 보안에 취약

>  세션

- 중요한 정보는 서버에 저장 후 그 정보 주소(session ID)만 쿠키에 담음
- 장점 :
  - 보안이 좋아짐
- 단점 :
  - 서버가 저장 0 -> 서버 저장 공간 사용 0 , stateless X

---

### JWT 

(JSON WEB TOKEN)

- JSON 형태의 데이터를 안전하게 전송하기 위한 (웹에서 사용하는) 토큰

- 장점 : 

  - 보안에 강하다 -> 암호화가 되어 있다.

  - 서버가 상태를 저장하지 않는다. -> stateless -> HTTP 특징을 잘 따름

  - 서버의 부담 줄여줄 수 있다.

    

> 구조

***헤더***

- 토큰을 암호화 하는데 사용한 알고리즘, 토큰의 형태 

***payload***

- 사용자 정보 담음

***서명***

- 페이로드 값 바뀜 -> 서명값 통째로 바뀜

> JWT 인증 - 인가 절차 

![JWT Auth](https://velog.velcdn.com/images/tngur0716/post/590c93af-e0bd-4c2a-9349-6f2f6011fae4/image.png)


1. client 가 server에 요청 보냄
2. server가 header, payload, signature를 정의 후 암오화 해 JWT 생성
3. server가 JWT 를 cookie에 담아 client에 발급
4. client는 JWT 저장, 인증 필요한 요청 마다 header에 token 담아 보냄
5. server는 token과 client로 부터 받은 token 비교
6. 일치시 payload client에게 전달
7. token 만료시, client는 refresh token을 server에 보냄
8. server는 새로운 access token 발급해 client에 전달



---

### .env

(Environment : 환경변수)

- 외부에 유출되면 안 되는 중요한 환경 변수들을 따로 관리하기 위한 파일
- 파일 확장자 -  `.env`
- 프로젝트 최상위 패키지에 존재해야함.



--- 
## 마치며
다양한 서버와 클라이언트의 통신 방법이 있고, 각자의 장단점을 보완한 JWT 에 대해서 조금더 자세히 알 수 있었다.
