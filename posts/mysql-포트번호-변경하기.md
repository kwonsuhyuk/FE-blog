---
title: "mysql 포트번호 변경하기"
date: "2024-04-17T06:20:13.537Z"
tags: ["db","sql"]
---

### 서론

mysql과 mariadb를 같이 사용하려고 하니깐 둘다 기본적으로 3306포트 번호로 지정되어 있어서 workbench 사용시에 불편함이 있었다 .
구글링을 해도 잘 해결되지 않아서 문서화 해놓을려고 작성함.

**-> mysql의 기본설정되어 있는 포트번호를 다른 번호로 변경하는 방법을 문서로 작성해 보려고 한다.**


### 맥 환경에서 mysql 설정 변경하기

#### 1. 터미널에서 mysql의 설정이 들어가 있는 파일을 찾는다. 


```bash
mysql --verbose --help | grep my.cnf
```

위의 명령어를 작성하면 `my.cnf`가 있을만한 곳의 경로를 알려준다. 


#### 2. 경로의 파일에 vi 명령어로 편집하기 

내 컴퓨터 같은 경우에는 
order of preference, my.cnf, $MYSQL_TCP_PORT,
/etc/my.cnf /etc/mysql/my.cnf /opt/homebrew/etc/my.cnf ~/.my.cnf
같이 출력되어서 일일히 하나씩 vi 명령어로 접근해봤다.

```bash
vi /opt/homebrew/etc/my.cnf

```
나 같은 경우에는 위의 경로에 파일이 있었는데, 파일을 위의 명령어로 접근해서 
```text
[mysqld]
# Only allow connections from localhost
bind-address = 127.0.0.1
mysqlx-bind-address = 127.0.0.1

// 여기 부분 추가
port = 3307
```

위의 부분을 수정후에 :wq로 저장후 닫으면 정상적으로 변경이 된 것을 알 수 있다 .