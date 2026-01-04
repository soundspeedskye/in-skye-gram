# 인스타그램 클론 코딩한 사이드 프로젝트 (README)

본 프로젝트는 스카이의 사이드 프로젝트로, 인스타그램의 레이아웃을 클론했습니다.

---

## 🚀 프로젝트 개요

| 항목         | 내용                              |
| ----------- | -------------------------------- |
| 프레임워크     | React 19                         |
| 스타일       | Tailwind CSS + shadcn/ui          |
| 상태관리      | Zustand + React Query            |
| API 통신     | RESTful API 기반, Axios 래퍼 사용   |
| 타입 시스템   | TypeScript                       |
| 테스트       | Vitest (단위)                     |
| 배포 환경     | 미정                              |

---

## 설치 및 실행

```shell
# 의존성 설치
yarn install // or yarn

# 로컬 실행
yarn dev

## 📁 폴더 구조 요약

```bash
📁 src/
├─ 📁 app/                            # 전역스타일/프로바이더/라우팅설정
│  ├─ 📁 providers/
│  ├─ 📁 routing/
│  │  ├─ 📄 routes.tsx
│  │  └─ 📄 paths.tsx
│	 └─	📁 styles/
│
├─ 📁 pages/                          # 라우트 단위 조립
│  ├─ 📁 main/
│  │  └─ 📄 MainPage.tsx
│  ├─ 📁 auth/
│  │  ├─ 📄 MyPage.tsx
│  │  ├─ 📄 SignInPage.tsx
│  │  └─ 📄 SignUpPage.tsx
│  └─ 📁 message/
│     └─ 📄 MessagePage.tsx
│
├─ 📁 widgets/                        # 여러 도메인이 합쳐진 UI
│  ├─ 📁 search/
│  │  ├─ 📁 ui/
│  │  │  └─ 📄 SearchSheet.tsx
│  │  └─ 📄 index.ts
│  └─ 📁 notification/
│     ├─ 📁 ui/
│     │  └─ 📄 NotificationSheet.tsx
│     └─ 📄 index.ts
│
├─ 📁 features/                       # 동사(CUD) 중심의 비즈니스 로직
│  ├─ 📁 sign-in/
│  │  ├─ 📁 ui/
│  │  │  └─ 📄 SignInForm.tsx
│  │  ├─ 📁 model/
│  │  │  ├─ 📄 sign-in.dto.ts
│  │  │  └─ 📄 sign-in.schema.ts
│  │  └─ 📄 index.ts
│  └─ 📁 create-post/
│     ├─ 📁 ui/
│     │  └─ 📄 CreatePostForm.tsx
│     ├─ 📁 model/
│     │  ├─ 📄 create-post.dto.ts
│     │  └─ 📄 create-post.schema.ts
│     └─ 📄 index.ts
│ 
├─ 📁 entities/                       # 명사(Read) 중심
│  └─ 📁 my-page/
│     ├─ 📁 ui/
│     │  ├─ 📄 MyPosts.tsx
│     │  └─ 📄 MyProfile.tsx
│     ├─ 📁 model/
│     │  ├─ 📄 my-post.ts
│     │  └─ 📄 my-profile.dto.ts
│     └─ 📄 index.ts
│
└─ 📁 shared/                         # 전역 공용
   ├─ 📁 lib/
   │  ├─ 📄 formatters.ts
   │  ├─ 📄 analytics.ts
   │  └─ 📄 logger.ts
   ├─ 📁 ui/
   │  ├─ 📁 core
   │  │  ├─ 📄 Button.tsx
   │  │  ├─ 📄 Input.tsx
   │  │  └─ 📄 ...etc.tsx
   │  └─ 📁 lib
   │  │  └─ 📄 ...shadcnComponent.tsx
   │  └─ 📄 index.ts
   └─ 📁 assets/
      ├─ 📁 fonts/
      ├─ 📁 icons/
      └─ 📁 images/
```

---

## FSD 패턴 요약

- app: 전역스타일/프로바이더/라우팅설정
- pages: 라우트 단위 조립
- widgets: 여러 도메인이 합쳐진 UI
- features: 동사(CUD) 중심의 비즈니스 로직
  - 기본적으로 동사로 작성되며, Create, Update, Delete와 관련된 비즈니스 로직과 해당 로직이 사용되는 UI 또는 사용자의 행위 및 시나리오가 포함된 기능 단위 및 UI는 여기에 해당함
- entities: 명사(Read) 중심 비즈니스 모델
  - 기본적으로 명사로 작성되며, Read와 관련된 비즈니스 로직과 해당 로직이 사용되는 UI가 여기에 해당함
  - 서버의 Entity와 비슷한 역할을 수행(작은 단위의 도메인, User, Product 등)
- shared: 전역에서 사용되는 함수 및 UI

---

## 도메인 분리 기준

- ✅ 비즈니스 로직, API 종속성, 사용자의 행위 (동사)가 포함된 기능 단위 및 UI는 `/features/{domain}` 내부에 배치
- ✅ 비즈니스 로직, API Domain 종속적인 기능 단위 및 UI는 `/entities/{domain}` 내부에 배치
- ✅ `api/`, `services/`, `hooks/`는 명확하게 역할 구분하여 관심사 분리 유지

---

## 네이밍 컨벤션 요약

| 구분                 | 예시               |
| -------------------- | ------------------ |
| 폴더 (도메인)        | `kebab-case`       |
| Model, api 파일명    | `kebab-case`       |
| 훅 파일명            | `kebab-case`       |
| Util 파일명          | `kebab-case`       |
| API 함수명           | `camelCase`        |
| 컴포넌트 파일/함수명 | `PascalCase`       |
| 타입/인터페이스      | `PascalCase`       |
| enum / 상수          | `UPPER_SNAKE_CASE` |

> 📌 전체 네이밍 규칙은 팀 컨벤션 문서에 상세 명시됨

---

## 참조

> 이 README는 프로젝트 구조를 빠르게 이해하고, 팀의 컨벤션에 따라 개발하기 위한 출발점입니다.
>
> **구조가 변경될 경우 반드시 README도 함께 갱신**해주세요
