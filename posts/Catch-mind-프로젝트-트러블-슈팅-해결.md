---
title: "[Catch Mind 프로젝트] 성능 최적화와 트러블 슈팅 경험"
date: "2026-01-05"
category: "Project"
---

## intro 
---
catchmind 프로젝트를 하면서 생겼던 문제와 문제해결 과정에 대해서 정리하기 위해서 
글을 작성했습니다.

## 문제 상황
---

```jsx
{/* 유저 4~명 */}
  <div className="grid h-full grid-cols-1 grid-rows-3 justify-items-center gap-10 w-1/5">
    {users.slice(3, 6).map((user) => {
      const userMessages = chattings
        .filter((chat) => chat.nickname === user.nickname)
        .map((chat) => {
          return { message: chat.message, isAnswer: chat.isAnswer };
        });
      return (
        <UserContainer
          key={user.userId}
          userId={user.userId}
          nickname={user.nickname}
          score={user.score}
          currentDraw={currentDrawer === user.nickname}
          profileImage={user.profileImage}
          masterName={masterNickname!}
          chatMessages={userMessages}
          isLeft={false}
        />
      );
    })}
    {memoizedUserContainers.slice(3)}
  </div>
```
기존 return 문에서 한번에 usercontainer를 리턴해 주다 보니 페이지가 리렌더링 될때마다 계속해서 usercontainer도 리렌더링이 되었고, 내부의 메시지 표시 로직이 꼬이는 문제가 있었습니다.

## 해결방안
---
따라서, 문제를 해결하기 위해서 usercontainer 컴포넌트를 부모 요소가 리렌더링 될때 마다 계속해서 리렌더링 되도록 하는것이 아닌 , 특정 값이 변할 때만 리렌더링 시키는 방식으로 수정해야 겠다고 생각이 들었다.

```jsx
 const memoizedUserContainers = useMemo(() => {
    return users.slice(0, 6).map((user, index) => {
      const userMessages = chattings
        .filter((chat) => chat.nickname === user.nickname)
        .slice(-1)
        .map((chat) => {
          return { message: chat.message, isAnswer: chat.isAnswer };
        });

      return (
        <UserContainer
          key={user.userId}
          userId={user.userId}
          nickname={user.nickname}
          score={user.score}
          currentDraw={currentDrawer === user.nickname}
          profileImage={user.profileImage}
          masterName={masterNickname!}
          chatMessages={userMessages}
          isLeft={index < 3} // index를 사용하여 isLeft 결정
        />
      );
    });
  }, [users, chattings, currentDrawer, masterNickname]);
```
위와 같이 useMemo를 사용해서 종속성 배열이 변할때만 재 렌더링하는 식으로 변환하였더니 부모 컴포넌트의 리렌더링 마다 usercontainer가 재 렌더링 하는 것 이 아닌, 아래 배열 안 값이 변할 때만 렌더링 되도록 하여 해결 할 수 있었다. 

![Trouble Shooting](https://velog.velcdn.com/images/tngur0716/post/11dbf4ee-2d3f-40ce-b94c-0f7d1b243b31/image.gif)

위와 같이 메시지가 정상 출력 후 잘 사라지는 것을 볼 수 있었고, 종속성 배열 외 다른 값의 영향을 받지 않는 모습을 볼 수 있었다. 

## +React.memo()
---
내가 사용한 `useMemo()` 와 비슷한 `React.memo()` 또한 컴포넌트 자체가 불필요하게 다시 렌더링 되는 것을 방지하는데, 전달된 props가 변경 되지 않는 한 해당 컴포넌트를 다시 렌더링하지 않도록 한다.
