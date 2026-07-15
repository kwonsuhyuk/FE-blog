---
title: "React에서 상태를 어디까지 전역으로 관리해야 할까"
date: "2026-07-15"
category: "React"
---

## intro
---

React 프로젝트를 진행하다 보면 상태를 어디에서 관리해야 할지 고민되는 경우가 많다.

처음에는 컴포넌트 내부에서 `useState`로 관리하다가, 여러 컴포넌트에서 같은 값이 필요해지면 props로 전달하게 된다.

하지만 컴포넌트 구조가 깊어질수록 props를 계속 전달해야 하고, 이를 해결하기 위해 모든 상태를 전역 상태로 옮기고 싶어질 수 있다.

전역 상태를 사용하면 여러 컴포넌트에서 값을 쉽게 가져올 수 있지만, 모든 상태를 전역으로 관리하는 것이 항상 좋은 방법은 아니다.

이번 글에서는 어떤 상태를 컴포넌트 내부에서 관리하고, 어떤 상태를 전역 상태로 관리하는 것이 좋은지 정리해보려고 한다.

## 지역 상태와 전역 상태
---

지역 상태는 특정 컴포넌트나 가까운 하위 컴포넌트에서만 사용하는 상태를 의미한다.

대표적으로 모달의 열림 여부, input 값, 드롭다운 선택 상태 같은 값이 있다.

```tsx
function SearchInput() {
  const [keyword, setKeyword] = useState("");

  return (
    <input
      value={keyword}
      onChange={(event) => setKeyword(event.target.value)}
    />
  );
}
```

위 코드에서 `keyword`는 `SearchInput` 내부에서만 사용된다.

다른 페이지나 컴포넌트에서 이 값이 필요하지 않다면 굳이 전역 상태로 옮길 필요가 없다.

반대로 로그인한 사용자 정보나 전체 화면에서 사용하는 테마, 여러 페이지에서 공유하는 장바구니 정보처럼 여러 영역에서 함께 사용하는 값은 전역 상태로 관리하는 것이 편할 수 있다.

```tsx
const user = useUserStore((state) => state.user);
```

중요한 것은 상태의 크기가 아니라, 해당 상태를 사용하는 범위다.

## 모든 상태를 전역으로 관리했을 때의 문제
---

전역 상태를 사용하면 props를 여러 단계로 전달하지 않아도 된다는 장점이 있다.

하지만 편하다는 이유로 모든 상태를 전역 store에 넣기 시작하면 store의 역할이 점점 커질 수 있다.

```tsx
interface AppState {
  user: IUser | null;
  keyword: string;
  isModalOpen: boolean;
  selectedTab: string;
  formValues: IFormValues;
  selectedEmployeeId: string | null;
}
```

사용자 정보부터 검색어, 모달 상태, 폼 데이터까지 하나의 store에서 관리하면 처음에는 값을 찾기 쉬워 보일 수 있다.

하지만 시간이 지나면 어떤 상태가 어느 화면에서 사용되는지 파악하기 어려워지고, 한 페이지에서만 필요한 상태가 다른 페이지에도 남아 있을 수 있다.

특히 폼의 input 값처럼 자주 변경되는 상태를 전역으로 관리하면 입력할 때마다 전역 store가 변경된다.

이 과정에서 해당 값을 구독하고 있는 컴포넌트가 많다면 불필요한 리렌더링도 발생할 수 있다.

전역 상태는 어디서든 접근할 수 있다는 장점이 있지만, 그만큼 상태의 변경 범위도 넓어질 수 있다.

## 상태가 필요한 범위부터 확인하기
---

상태를 만들 때는 먼저 해당 값이 어디에서 필요한지 확인하는 것이 좋다.

예를 들어 직원 상세 모달의 열림 여부가 직원 목록 페이지에서만 사용된다고 생각해볼 수 있다.

```tsx
function EmployeePage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<
    string | null
  >(null);

  return (
    <>
      <EmployeeTable onSelect={setSelectedEmployeeId} />

      <EmployeeDetailModal
        employeeId={selectedEmployeeId}
        onClose={() => setSelectedEmployeeId(null)}
      />
    </>
  );
}
```

`selectedEmployeeId`는 `EmployeeTable`과 `EmployeeDetailModal`에서 사용된다.

두 컴포넌트가 같은 페이지 컴포넌트 아래에 있기 때문에 부모인 `EmployeePage`에서 상태를 관리하는 것으로 충분하다.

이 상태를 전역으로 옮기면 다른 페이지에서도 접근할 수 있지만, 실제로 다른 페이지에서는 사용할 일이 없다.

따라서 상태를 무조건 컴포넌트 내부에 두거나 전역으로 옮기는 것이 아니라, 함께 사용하는 컴포넌트들의 가장 가까운 공통 부모에서 관리하는 것이 좋다.

## props drilling은 무조건 문제일까
---

상태를 여러 단계로 전달하다 보면 props drilling이라는 문제가 발생할 수 있다.

```tsx
function App() {
  const [user, setUser] = useState<IUser | null>(null);

  return <Layout user={user} />;
}

function Layout({ user }: { user: IUser | null }) {
  return <Header user={user} />;
}

function Header({ user }: { user: IUser | null }) {
  return <UserProfile user={user} />;
}
```

`Layout`은 `user`를 직접 사용하지 않지만, `UserProfile`에 전달하기 위해 props로 받아야 한다.

이런 구조가 여러 단계로 반복되면 props 관리가 불편해질 수 있다.

하지만 props를 한두 단계 전달하는 것까지 무조건 문제라고 볼 필요는 없다.

props를 통해 데이터의 흐름이 명확하게 보인다는 장점도 있기 때문이다.

전달 단계가 깊어지고, 중간 컴포넌트가 값을 사용하지 않는데도 계속 전달해야 한다면 그때 Context나 전역 상태 사용을 생각해볼 수 있다.

```tsx
const user = useUserStore((state) => state.user);
```

전역 상태를 사용하는 기준은 props를 전달하기 귀찮은지가 아니라, 실제로 여러 영역에서 같은 상태를 공유하는지 확인하는 것이 중요하다.

## 서버 상태를 전역 store에 넣지 않기
---

전역 상태를 관리할 때 자주 생기는 문제 중 하나는 API로 받아온 데이터까지 모두 store에 저장하는 것이다.

```tsx
interface EmployeeStore {
  employees: IEmployee[];
  setEmployees: (employees: IEmployee[]) => void;
  isLoading: boolean;
  error: Error | null;
}
```

직원 목록을 직접 store에서 관리하면 API 요청 상태, 에러, 캐싱, 데이터 갱신까지 모두 직접 처리해야 한다.

```tsx
const fetchEmployees = async () => {
  set({ isLoading: true });

  try {
    const employees = await getEmployees();

    set({
      employees,
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error as Error,
      isLoading: false,
    });
  }
};
```

이 방식도 사용할 수 있지만, 서버에서 가져온 데이터는 TanStack Query 같은 서버 상태 관리 도구를 사용하는 것이 더 적합할 수 있다.

```tsx
const { data: employees, isLoading, error } = useQuery({
  queryKey: ["employees"],
  queryFn: getEmployees,
});
```

TanStack Query를 사용하면 캐싱, 로딩 상태, 에러 처리, 데이터 갱신 같은 기능을 직접 만들지 않아도 된다.

Zustand 같은 전역 상태는 서버 데이터 자체보다는 모달 상태, 선택된 항목, 사이드바 상태처럼 클라이언트에서만 관리되는 값에 사용하는 것이 역할을 나누기 좋다.

```tsx
interface EmployeeUIStore {
  selectedEmployeeId: string | null;
  isDetailModalOpen: boolean;
  openDetailModal: (employeeId: string) => void;
  closeDetailModal: () => void;
}
```

서버 상태와 클라이언트 상태를 분리하면 각 상태가 어디에서 변경되고 관리되는지 파악하기 쉬워진다.

## Zustand에서 필요한 상태만 가져오기
---

전역 상태를 사용하기로 했다면 store 전체를 가져오기보다 필요한 값만 선택해서 사용하는 것이 좋다.

```tsx
const store = useEmployeeStore();
```

위 방식은 store 안의 여러 상태를 한 번에 가져온다.

store의 구조나 사용하는 방식에 따라서는 내가 사용하지 않는 값이 변경됐을 때도 컴포넌트가 다시 렌더링될 수 있다.

```tsx
const selectedEmployeeId = useEmployeeStore(
  (state) => state.selectedEmployeeId,
);
```

필요한 값만 선택하면 컴포넌트가 어떤 상태에 의존하고 있는지 더 명확하게 확인할 수 있다.

여러 상태를 함께 가져오는 경우에는 `useShallow`를 사용할 수 있다.

```tsx
const { selectedEmployeeId, closeDetailModal } = useEmployeeStore(
  useShallow((state) => ({
    selectedEmployeeId: state.selectedEmployeeId,
    closeDetailModal: state.closeDetailModal,
  })),
);
```

전역 상태를 사용하는 것보다 더 중요한 것은 각 컴포넌트가 필요한 상태만 구독하도록 만드는 것이다.

## 폼 상태는 지역 상태로 관리하기
---

폼 상태는 대부분 해당 폼 컴포넌트 안에서만 사용된다.

```tsx
function EmployeeForm() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  return (
    <form>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <input
        value={department}
        onChange={(event) => setDepartment(event.target.value)}
      />
    </form>
  );
}
```

이런 값을 전역 상태로 옮기면 사용자가 글자를 입력할 때마다 store가 변경된다.

또한 폼을 닫았을 때 입력값을 초기화하거나, 다른 페이지로 이동했을 때 이전 값이 남아 있는 문제도 직접 처리해야 한다.

폼 안에서만 사용하는 값이라면 `useState`나 React Hook Form으로 관리하는 것이 더 자연스럽다.

```tsx
const {
  register,
  handleSubmit,
  reset,
} = useForm<IEmployeeForm>();
```

여러 페이지에 걸쳐 작성하는 회원가입이나 주문서처럼 입력 상태를 계속 유지해야 하는 경우에는 전역 상태를 사용할 수 있다.

하지만 일반적인 입력 폼까지 무조건 전역으로 관리할 필요는 없다.

## Context와 전역 상태 선택하기
---

여러 컴포넌트에서 상태를 공유해야 한다고 해서 항상 Zustand 같은 라이브러리가 필요한 것은 아니다.

테마나 특정 페이지 내부의 공통 설정처럼 변경 빈도가 낮고 범위가 제한된 값은 Context로 관리할 수 있다.

```tsx
const ThemeContext = createContext<IThemeContext | null>(null);
```

Context는 별도의 라이브러리 없이 사용할 수 있고, 특정 컴포넌트 트리 안에서 값을 공유하기 좋다.

하지만 자주 변경되는 상태가 많거나, 상태를 선택적으로 구독해야 하는 경우에는 전역 상태 라이브러리가 더 편할 수 있다.

예를 들어 사용자 정보, 모달 관리, 여러 화면에서 공유하는 UI 상태처럼 store 구조와 상태 변경 함수가 필요한 경우에는 Zustand를 사용할 수 있다.

중요한 것은 어떤 도구가 더 좋다고 정하는 것이 아니라, 상태의 변경 빈도와 사용 범위에 맞는 방법을 선택하는 것이다.

## 전역 상태를 사용하기 전에 확인할 점
---

상태를 전역으로 옮기기 전에는 몇 가지를 먼저 확인하는 것이 좋다.

첫 번째는 해당 상태를 실제로 여러 컴포넌트나 페이지에서 사용하는지다.

한 페이지의 두 컴포넌트에서만 사용한다면 가까운 부모 컴포넌트에서 관리할 수 있다.

두 번째는 페이지를 이동한 뒤에도 상태가 유지되어야 하는지다.

모달의 열림 여부나 검색 input 값처럼 페이지를 벗어나면 필요 없는 값이라면 지역 상태가 더 적합할 수 있다.

세 번째는 서버에서 가져오는 데이터인지 확인해야 한다.

API 데이터라면 전역 store에 직접 저장하기보다 TanStack Query 같은 서버 상태 관리 도구를 사용하는 방법을 먼저 생각해볼 수 있다.

마지막으로 상태의 변경 빈도도 확인해야 한다.

input 값처럼 자주 바뀌는 값을 전역으로 관리하면 상태 변경 범위가 불필요하게 커질 수 있다.

## 정리
---

React에서 상태를 관리할 때는 지역 상태와 전역 상태 중 하나를 무조건 선택하는 것이 아니다.

상태가 사용되는 범위와 변경되는 방식에 따라 관리 위치를 정하는 것이 중요하다.

정리하면 다음과 같다.

- 한 컴포넌트에서만 사용하는 값은 지역 상태로 관리한다.
- 가까운 여러 컴포넌트에서 사용하는 값은 공통 부모에서 관리한다.
- 여러 페이지와 컴포넌트에서 공유하는 값은 전역 상태 사용을 생각해본다.
- API 데이터는 TanStack Query 같은 서버 상태 관리 도구를 사용한다.
- 폼 입력값은 필요한 경우가 아니라면 지역 상태로 관리한다.
- 전역 store에서는 컴포넌트에 필요한 값만 선택해서 가져온다.

전역 상태를 많이 사용하는 것이 상태 관리를 잘하는 것은 아니다.

상태가 필요한 범위를 최대한 좁게 유지하고, 여러 영역에서 실제로 공유해야 하는 값만 전역으로 관리하는 것이 더 이해하기 쉬운 구조를 만드는 데 도움이 된다고 생각한다.
