---
title: "[도서정보 API 프로젝트] MySQL 외래키(FK) 설정 중 발생한 오류 해결"
date: "2025-11-13"
category: "Project"
---

### 문제 
![FK Error](https://velog.velcdn.com/images/tngur0716/post/eaaa3ad9-0fd3-4a69-b18c-8bccbb19f9fb/image.png)

cartItems 테이블의 외래키를 설정하려고 하니 위와 같은 오류가 나왔다 .
- `errno: 121 "Duplicate key on write or update”`

### 문제 해결

Foreign Key 의 이름이 중복되어서 발생한 오류라 중복되지 않도록 
FK 제약조건에 따라서 이름을 변경해주었다 .
![Solution](https://velog.velcdn.com/images/tngur0716/post/e8d12136-6df1-48d0-ab25-4d41c444305b/image.png)


### +추가적으로 ,

외래키를 참조하는 테이블에는 인덱스 (Indexes) 가 자동적으로 생성되는데 이부분도 중복이 되면 오류가 발생한다. 
`error: 1061 duplicate key name`
따라서 인덱스의 부분도 중복이 되지않도록 체크해줘야 한다.![Index Error](https://velog.velcdn.com/images/tngur0716/post/88d96fd7-fb0c-422e-a4e2-c937017eff62/image.png)


#### 앞으로 FK 를 사용시에는 제약조건에 따라서 이름이 중복되지 않도록 이름을 작성해줘야 겠다 .
