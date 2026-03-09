---
title: "Node.js의 요청 처리 흐름 분석"
date: "2025-08-17"
category: "Dev"
---

## - index.js
### index.js 에서 server.js에 router, handler 내려줌

```js
server.start(router.route, requestHandler.handle);
```
---
## - server.js
### server.js 에서 index.js 에서 받은 인수들을 통해 server 실행

```js
function start(route, handle) {
  function onRequest(request, response) {
    let pathname = url.parse(request.url).pathname;

    let queryData = url.parse(request.url, true).query;

    route(pathname, handle, response, queryData.productId);
  }

  http.createServer(onRequest).listen(8888);
}
```
---
## - router.js
### server.js 에서 받은 handler, pathname, response 등을 통해 경로에 따른 handler 를 넘겨줌

```js
function route(pathname, handle, response, productId) {
  console.log("pathname: " + pathname);

  if (typeof handle[pathname] === "function") {
    handle[pathname](response, productId);
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.write("찾으시는 페이지가 없습니다.");
    response.end();
  }
}
```
---
## - requestHandler.js

### 경로에 따라서 해당 handler를 실행
```js
let handle = {};
// key:value
handle["/"] = main;
handle["/order"] = order;
handle["/orderlist"] = orderlist;

/* image directory */
handle["/img/redRacket.png"] = redRacket;
handle["/img/blueRacket.png"] = blueRacket;
handle["/img/blackRacket.png"] = blackRacket;
```

### handler 함수 정의 해주기 
```js
function orderlist(response) {
  response.writeHead(200, { "Content-Type": "text/html" });
  mariadb.query("SELECT * FROM orderlist", function (err, rows) {
    response.write(orderlist_view);

    rows.forEach((element) => {
      response.write(
        "<tr>" +
          "<td>" +
          element.product_id +
          "</td>" +
          "<td>" +
          element.order_date +
          "</td>" +
          "</tr>"
      );
    });
    response.write("</table>");
    response.end();
  });
}
```
---
## + response.write(data) 로 data 보여주기

1. fs.readFileSync() 로  파일 읽어오기
```js
const main_view = fs.readFileSync("./main.html");
```
2. response.write(main_view); 로 해당 조건에서 보여줌
```js
response.write(main_view);
```
---
### + fs.readFileSync(), fs.readFile() 

> fs.readFileSync()

- 동기적인 함수 즉, 파일 읽기 작업이 완료될 때까지 프로그램의 실행이 중지되고, 완료되면 결과를 반환
- 콜백함수 사용 불가능
		
> fs.readFile()

-  비동기적인 함수. 파일 읽기 작업이 시작되면 프로그램의 실행이 계속 진행되고, 읽기 작업이 완료되면 콜백 함수가 호출
- 콜백함수 사용 가능
```js
fs.readFile("./img/blackRacket.png", function (err, data) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(data);
    response.end();
  });
```
