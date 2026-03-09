---
title: "[도서정보 API 프로젝트] 데이터 삭제 시 발생하는 외래키 제약 조건 오류 해결"
date: "2025-11-17"
category: "Project"
---

## 문제
![Truncate Error](https://velog.velcdn.com/images/tngur0716/post/8f586e8a-f931-444f-a10c-8e658ad2ae6c/image.png)

sql 에서 데이터를 삭제하려고 하니 위와 같은 오류가 발생하였다 .
`Error Code: 1701. Cannot truncate a table referenced in a foreign key constraint`

외래키가 있는 테이블에서 데이터를 삭제할 수 없다는 오류이다.

###  문제 해결

일시적으로 
```js 
set FOREIGN_KEY_CHECKS = 0; 
```
을 통해서 외래키를 무시하고 작업을 할 수 있도록 한다.

이렇게 설정 후에 다시 데이터를 삭제 하니 삭제가 정상적으로 잘 되었다. 

그 후 반드시 

```js 
set FOREIGN_KEY_CHECKS = 1; 
```

설정을 해서 외래키를 다시 참조하도록 설정을 해줘야 
무결성 위반이 되지 않는다. 

### + MYSQL 데이터 삭제 방법

1. `DELETE `

   - DELETE FROM 테이블명 

     : 조건이 없으면 모든 행이 삭제된다. (테이블은 남아있음)

2. `DROP`

   - DROP TABLE 테이블명

     : 테이블을 통째로 삭제하는 것

3. `TRUNCATE`

   - 모든 행이 삭제된다. (테이블은 남아있음)
   - Auto_increment 값이 자동으로 초기화 된다.


---
#### ++ 데이터를 삭제시에는 FK를 들고 있는 테이블 부터 삭제 후 ,
#### 그 후 참조되는 테이블을 삭제 하는 것이 좋다. (무결성 유지하기 위함)
