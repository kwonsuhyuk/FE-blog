---
title: "[SQL] JOIN 완벽 정리"
date: "2025-07-24"
category: "Dev"
---

## Join 이란?
![Join](https://velog.velcdn.com/images/tngur0716/post/29facc49-c51d-4597-aa74-e7bdc1052d02/image.png)
두 개 이상의 테이블에서 공통된 값을 기준으로 데이터를 결합하는 SQL 명령어

###### (출처:https://learnsql.com/blog/learn-and-practice-sql-joins/)


### 왜 사용할까?
관련된 데이터를 여러 테이블에서 효율적으로 검색하고, 데이터베이스의 성능을 향상 시키기 위해서 사용한다. 
(여러 테이블에 저장된 관련 데이터에 동시에 접근할 수 있다.)

---

### LEFT JOIN (LEFT OUTER JOIN)
왼쪽 테이블의 모든 레코드와 오른쪽 테이블에서 일치하는 레코드를 포함함.
일치하는 레코드 없을시 왼쪽 테이블의 레코드는 결과에 포함 오른쪽은 null 로 표시

ex) 
Employees 테이블과 Department 테이블 있을 시에 
모든 직원과 그들이 속한 부서의 정보 조회 경우

```sql
SELECT Employees.name, Departments.department_name
FROM Employees
LEFT JOIN Departments ON Employees.department_id = Departments.id;
```

### RIGHT JOIN (RIGHT OUTER JOIN)
오른쪽 테이블 기준으로 JOIN

### INNER JOIN
두 테이블 간의 교집합을 반환함.
즉, JOIN 조건에 일치하는 레코드만을 결과로 가져온다. 
일치 레코드 없을 시에는 해당 레코드 결과에 포함하지 않는다.

ex)
부서의 속한 직원들의 정보만을 조회할 경우

```sql
SELECT Employees.name, Departments.department_name
FROM Employees
INNER JOIN Departments ON Employees.department_id = Departments.id;
```
