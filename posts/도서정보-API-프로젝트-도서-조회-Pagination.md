---
title: "[도서정보 API 프로젝트] offset과 limit을 이용한 도서 조회 Pagination 구현"
date: "2025-11-23"
category: "Project"
---

![Pagination](https://velog.velcdn.com/images/tngur0716/post/91f2af3f-a480-40c2-b4d7-f5f967d40600/image.png)

## 도서 정보에서 pagination 구현하기

도서 정보들을 한페이지에 다 불러오는 것은 불필요하기에 `offset` , `limit` , `SQL_CALC_FOUND_ROWS` , `found_rows()` 를 사용해서 pagination을 구현해 볼 예정이다.

---

### `SQL_CALC_FOUND_ROWS` 이란?

_**SELECT**_ 명령어와 함께 사용되며 , LIMIT 을 사용해 조회되는 행의 수를 제한할 때, 제한 되지 않은 전체 결과의 수를 계산 하는데 사용된다. 
<u>**즉 , LIMIT으로 인해 반환되는 실제 행 수와 관계없이 쿼리가 실행될 경우 반환될 수 있는 전체 행의 수를 알고 싶을 때 유용하다.**</u>

ex ) 
```js
SELECT SQL_CALC_FOUND_ROWS * FROM books LIMIT 10;
```
- 처음 10개 행만 반환하지만, 내부적으로 전체 행의 개수를 저장해놓는다. 


### `SELECT FOUND_ROWS()` 이란 ?

가장 최근에 실행된 `SQL_CALC_FOUND_ROWS`가 포함된 SELECT 쿼리가 제한 없이 반환했을 때의 전체 행의 수를 반환한다. 

### LIMIT

쿼리로 부터 반환되는 행의 수를 제한하는 데 사용된다. 


### OFFSET

특정 위치 이후의 행부터 데이터를 가져오기 시작하는 지점을 지정하는데 사용된다. 


ex)
```js
SELECT * FROM users LIMIT 10 OFFSET 10;
```

> ### + 
```js
SELECT * FROM users LIMIT 10, 10;
```
이런 식으로 OFFSET을 생략하고 사용할수도 있다. 

---

## 도서 정보 API에 적용해보기 

### 1. request 로 받은 쿼리로 offset 계산하기

```js
let { category_id, news, limit, currentPage } = req.query;

let offset = limit * (currentPage - 1);
```

### 2. sql 문에 `SQL_CALC_FOUND_ROWS` 추가하기 

```js
let sql =
    "SELECT SQL_CALC_FOUND_ROWS books.*, (SELECT COUNT(*) FROM likes WHERE books.id = likes.liked_book_id) AS likes FROM books LIMIT ? OFFSET ?";

// limit은 query에서 받아오므로 string값으로 오기에 parseInt로 변환해주기
let values = [parseInt(limit), offset]

```
SELECT 바로 뒤에 `SQL_CALC_FOUND_ROWS` 로 전체 책의 개수를 저장해준다. 그리고 받은 LIMIT과 
계산한 OFFSET을 ?를 이용해서 변수로 받아준다.

### 3. 책 목록 가져오기 
```js
conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) allBooksRes.books = results;
    else return res.status(StatusCodes.NOT_FOUND).end();
  });

```
`result` 에 책 목록을 담아준다. 뒤에 추가적으로 pagination을 위한 정보를 받아줘야 하기에 변수에 담아주기만 한다.

### 4. `found_rows()` 로 저장해둔 값 가져오기

```js
 sql = "SELECT found_rows()";

  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    let pagination = {};
    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount = results[0]["found_rows()"];

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  });
```

`SELECT found_rows()` 로 저장해둔 총 책의 개수를 가져와 totalCount 변수에 넣어준다. 
넣어줄 때는 results값이 아래와 같이 오기때문에 
![found_rows](https://velog.velcdn.com/images/tngur0716/post/1c35ef34-54f7-4764-9f3e-2432c7a9d11e/image.png)

`results[0]["found_rows()"];` 위와 같이 넣어주었다 .

pagination 객체를 allBooksRes 에 넣어서 최종적으로 return 해주면

![result](https://velog.velcdn.com/images/tngur0716/post/78e4566a-14f7-4884-917b-35bb3ef88ece/image.png)

위와 같이 책들 목록이 limit수 에 맞게 제한되어 나오며 , pagination에 대한 정보도 함께 리턴이 되는 것을 볼 수 있다. 
