---
title: "Docker 환경에 MariaDB 설치 및 설정"
date: "2025-08-11"
category: "Dev"
---

## Docker를 왜 사용하는 가 ?
![Docker](https://velog.velcdn.com/images/tngur0716/post/23b185ef-d7e2-436e-8a8c-1506ed9a0b6c/image.png)
1. 개발 환경의 일관성 
--
- 개발, 테스트, 운영환경을 동일하게 구성 가능하다. 
- dockerfile을 통해 필요한 언어, 패키지, 등을 어느 컴퓨터에서든 자동으로 설치 가능 .
2. 서버 관리의 효율성
--
- 서버 이전 및 확장 용이 성에 유용하다. 
- 하나의 물리 서버에서 여러 Docker 컨테이너를 통해서 다양한 서비스 관리 가능
3. 환경 구애 받지 않는 애플리케이션 실행
--
- Docker 컨테이너를 통해 애플리케이션과 . 그종속성을 격리된 환경에서 실행 가능. -> 다양한 환경에서도 애플리케이션을 일관되게 실행가능.

---


## MariaDB 컨테이너 생성 실행
1. Docker 이미지 가져오기
`docker pull mariadb`

2. MariaDB 컨테이너 생성 및 실행
`docker run -p 3306:3306 --name [컨테이너 이름] -e MARIADB_ROOT_PASSWORD=[비밀번호] -d mariadb`
- -d : 컨테이너를 백그라운드에서 실행함
3. MariaDB에 접속하기
`docker exec -it [컨테이너 이름] mariadb -uroot -p`
---
## Docker의 이미지와 컨테이너
### Docker 이미지
- 컨테이너를 생성하는 데 필요한 설정, 종속성, 실행 파일 등을 포함하는 불변의 파일 시스템. 컨테이너를 실행하기 위한 모든 정보 가짐
- 읽기 전용 템플릿
### Docker 컨테이너
- 이미지를 바탕으로 생성된 실행 가능한 인스턴스. 독립된 환경에서 애플리케이션을 실행할 수 있게 해준다.
---
## Docker 관련 명령어
### Docker 이미지 관련 명령어
- 이미지 검색
	`docker search [이미지 이름]`
	- Docker Hub에서 사용 가능한 이미지를 검색.
- 이미지 다운로드
	`docker pull [이미지 이름]:[태그]`
	- Docker Hub로부터 이미지를 다운로드.
- 이미지 목록 보기
	`docker images`
	- 현재 시스템에 다운로드된 이미지들의 목록을 보여줌.
### Docker 컨테이너 관련 명령어
- 컨테이너 생성 및 실행
	`docker run [옵션] [이미지 이름] [실행할 파일]`
	- 새로운 컨테이너를 생성하고 실행. -d 옵션을 사용하면 백		그라운드에서 실행.
- 실행 중인 컨테이너 목록 보기
	`docker ps`
	- 현재 실행 중인 컨테이너의 목록을 보여줌.
- 모든 컨테이너 목록 보기
	`docker ps -a`
	- 실행 중이거나 중지된 모든 컨테이너의 목록을 보여줌.
- 컨테이너 중지
	`docker stop [컨테이너 ID 또는 이름]`
	- 실행 중인 컨테이너를 중지.
- 컨테이너 시작
	`docker start [컨테이너 ID 또는 이름]`
	- 중지된 컨테이너를 다시 시작.
