# Supabase API Guide & Architecture

이 문서는 프로젝트의 Supabase API 구조, 핵심 로직, 그리고 테스트 환경에 대한 가이드를 제공합니다.

> [!NOTE]
> 현재 프로젝트는 **신규 통합 API**(마이그레이션된 로직)와 **기존 조각화된 구조**가 공존하고 있습니다. 이 문서는 신규 마이그레이션된 코드를 중심으로 설명하며, 추후 기존 폴더들에 이 로직을 적용할 예정입니다.

## 1. API 기능 요약 (Core API Reference)

| 분류 및 파일 경로 (Category & Path) | 기능 상세 (Feature) | 함수명 (Function) | 상세 설명 및 데이터 흐름 (Description & Data Flow) |
| :--- | :--- | :--- | :--- |
| **인증 (Auth)**<br>`src/features/auth/...` | 로그인 처리 | `signIn` | 이메일 인증 후 세션을 생성합니다. 성공 시 **`ensureUserProfile`**을 호출하여 프로필을 자동 생성합니다. |
| | 회원가입 처리 | `signUp` | Supabase Auth를 통해 계정을 생성하고 이메일 확인 메일을 발송합니다. |
| | 프로필 보장 | `ensureUserProfile` | **[핵심 로직]** `user_profiles`에 레코드가 없는 경우 기본 정보를 생성하여 시스템 정합성을 유지합니다. |
| **피드 (Feed)**<br>`src/entities/feed/api/feed.supabase.ts` | **목록 조회 (기본)** | `getFeeds` | 전체 피드를 최신순으로 페이징 조회합니다. (비로그인/단순 열람용) |
| | **단건 조회 (기본)** | `getFeed` | 특정 피드 ID의 정보를 가져옵니다. 좋아요/북마크 상태는 포함되지 않습니다. |
| | 피드 생성 | `createFeed` | **Edge Function 연동**: 이미지 업로드와 DB 레코드 생성을 원자적으로 처리합니다. 작성자의 `post_count`가 자동 증가합니다. |
| | 피드 수정 | `updateFeed` | 본인의 피드인 경우에만 캡션을 수정합니다. (이미지 수정 불가) |
| | 피드 삭제 | `deleteFeed` | DB 레코드를 삭제합니다. **DB 트리거**가 작동하여 `post_count`가 감소하며, 관련 스토리리 파일도 일괄 제거됩니다. |
| | 본인 피드 필터링 | `getMyFeeds` | 현재 로그인 유저가 작성한 피드들만 필터링하여 반환합니다. |
| **피드 상태 연동 (Status)**<br>`src/features/feed/api/feed-status.supabase.ts` | **목록 조회 (상태 포함)** | **`getFeedsWithStatus`** | **[권장 - 로그인 시]** 현재 유저의 **좋아요/북마크 여부(`isLiked`, `isBookmarked`)**를 일괄 매핑하여 반환합니다. |
| | **단건 조회 (상태 포함)** | **`getFeedWithStatus`** | **[권장 - 로그인 시]** 단일 피드 상세 정보와 함께 **본인의 상호작용 상태**를 포함하여 반환합니다. |
| **좋아요 (Like)**<br>`src/features/feed/like/api/like.supabase.ts` | 좋아요 등록/취소 | `likeFeed`, `unlikeFeed` | `feed_likes` 레코드를 생성/삭제합니다. **DB 트리거**가 피드의 `likes_count`를 자동 갱신합니다. |
| | 상태 확인 | `isLiked`, `areLiked` | 특정 게시물에 대해 현재 사용자가 좋아요를 눌렀는지 여부를 조회합니다. |
| **북마크 (Bookmark)**<br>`src/features/feed/bookmark/api/bookmark.supabase.ts` | 북마크 추가/취소 | `bookmarkFeed`, `unbookmarkFeed` | `feed_bookmarks` 레코드를 관리합니다. 개인 저장용으로 사용됩니다. |
| | 상태 확인 | `isBookmarked`, `areBookmarked` | 특정 피드들에 대한 본인의 북마크 여부를 확인합니다. |
| **공유 (Share)**<br>`src/features/feed/share/api/share.supabase.ts` | 피드 공유 등록 | `shareFeed` | `feed_shares` 레코드를 생성합니다. **DB 트리거**가 피드의 `shared_count`를 자동 증가시킵니다. |
| | 공유 목록 조회 | `getSharedFeeds` | 현재 유저가 공유한 피드 목록을 최신순으로 페이징 조회합니다. |
| **댓글 (Comment)**<br>`src/features/feed/comment/api/comment.supabase.ts` | 댓글 작성 | `createComment` | `feed_comments`에 레코드를 추가합니다. **DB 트리거**가 피드의 `comments_count`를 자동 증가시킵니다. |
| | 트리 구조 조회 | `getComments` | 댓글 데이터를 가져와 **부모-자식 계층 트리 구조**로 변환하여 반환합니다. |
| | 댓글 수정/삭제 | `updateComment`, `deleteComment` | 본인 댓글을 수정하거나 삭제합니다. 삭제 시 **트리거**가 카운트를 차감합니다. |
| **프로필 (Profile)**<br>`src/entities/user-profile/api/user-profile.supabase.ts` | 프로필 조회 | `getCurrentUserProfile`, `getUserProfile` | 본인 또는 타인의 `nickname`, `post_count`, `follower_count` 등을 조회합니다. |
| | 정보 업데이트 | `updateUserProfile` | 닉네임, 프로필 이미지 URL 등을 `user_profiles` 테이블에 반영합니다. |
| **팔로우 (Follow)**<br>`src/features/user/follow/api/follow.supabase.ts` | 팔로우/언팔로우 | `follow_user`, `unfollow_user` | **RPC (DB Function)** 호출을 통해 원자적으로 관계를 맺고 카운트를 동기화합니다. |
| | 상태 및 수치 확인 | `isFollowing`, `getFollowCounts` | 팔로우 여부 및 팔로워/팔로잉 총 숫자를 조회합니다. |
| **스토리지 (Storage)**<br>`src/shared/api/imageStorage.ts` | 리소스 제거 | `removeAll` | 피드 삭제 시 해당 경로의 모든 이미지를 일괄 삭제합니다. |

---

## 2. API 아키텍처 및 핵심 유틸리티

프로젝트는 **FSD(Feature-Sliced Design)** 구조를 준수하며, API 코드는 목적에 따라 분산 배치되어 있습니다.

### 파일 구조 (FSD)
- **`src/shared/api/`**: 전역 설정 및 공통 유틸리티
    - `supabase.ts`: Supabase 클라이언트 인스턴스
    - `user-profile.utils.ts`: 프로필 자동 생성(`ensureUserProfile`) 등 핵심 헬퍼
    - `imageStorage.ts`: 스토리지 파일 관리 유틸리티
- **`src/entities/[domain]/api/`**: 도메인 데이터 중심의 기본 CRUD (`feed.supabase.ts`, `user-profile.supabase.ts`)
- **`src/features/[function]/api/`**: 유저 인터랙션 기능 중심 (`like.supabase.ts`, `follow.supabase.ts`, `comment.supabase.ts`)

### 핵심 유틸리티
- **`ensureUserProfile(userId)`**: 인증 세션은 있으나 프로필 테이블에 정보가 없는 경우를 방지하기 위해 기본 데이터를 생성합니다.
- **`getCurrentUser()` / `requireCurrentUser()`**: 현재 로그인된 사용자의 ID와 세션 정보를 안전하게 가져옵니다.

---

## 3. 데이터 매핑 및 케이스 변환 (Automated Case Conversion)

프로젝트에서는 DB의 **snake_case** 데이터를 앱의 **camelCase** 모델로 자동 변환하는 표준화된 방식을 사용합니다.

### 핵심 매커니즘
- **`Camelize<T>` (Type)**: Supabase가 생성한 `Tables` 타입을 바탕으로 모든 필드를 재귀적으로 camelCase로 변환한 타입을 생성합니다.
- **`toCamelCase(obj)` (Utility)**: 런타임에 객체(중첩 객체 및 배열 포함)의 키를 snake_case에서 camelCase로 재귀적으로 변환합니다.

### 사용 예시 (코드 패턴)
새로운 API를 작성할 때 수동 매퍼 함수를 만드는 대신 아래 패턴을 권장합니다.

```typescript
import { toCamelCase } from '@/shared/lib/utils/case';
import type { Tables, Camelize } from '@/shared/api/types';

// 1. 도메인 타입 정의 (자동 변환)
export type MyEntity = Camelize<Tables<'my_table'>>;

// 2. API 함수 내 적용
const { data } = await supabase.from('my_table').select().single();
return toCamelCase<MyEntity>(data);
```

> [!TIP]
> 조인 쿼리(`select('*, user_profiles(*)')`)의 경우에도 `toCamelCase`는 중첩된 `user_profiles`를 `userProfiles`로 자동 변환합니다.

---

## 4. 테스트 환경 (Vitest)

모든 API 로직은 `src/shared/api/__tests__/` 내의 테스트 코드를 통해 검증됩니다.

### 주요 테스트 파일
- `auth.spec.ts`: 로그인/회원가입 및 프로필 자동 생성 흐름
- `feed.spec.ts`: 피드 조회, 생성, 수정, 삭제 및 상호작용(좋아요, 북마크, 댓글)
- `profile.spec.ts`: 프로필 정보 조회 및 팔로우 RPC 기능

---

## 4. 트러블슈팅 및 주의 사항

### 외래 키 (Foreign Key) 참조 힌트
Supabase Client를 통한 Join 쿼리 시, 외래 키 명칭이 충돌하거나 명확한 지정이 필요한 경우 아래와 같은 힌트를 사용합니다. (스키마 기준 검토 완료)

- **피드 작성자 프로필**: `user_profiles!feeds_user_id_profile_fkey`
- **팔로우 관계 프로필**: 
    - 팔로워: `user_profiles!follows_follower_profile_fkey`
    - 팔로잉 대상: `user_profiles!follows_following_profile_fkey`
- **댓글 작성자 프로필**: `user_profiles!feed_comments_user_id_profile_fkey`

### 기타
- **트랜잭션**: 피드 생성과 이미지 업로드처럼 복합적인 작업은 Edge Function(`/functions/v1/create-feed`)을 통해 처리합니다.
- **타입 갱신**: DB 스키마 변경 후에는 `yarn gen:types`를 실행하여 `supabase.types.ts`를 최신화해야 합니다.

---

## 5. 주요 명령어 (Scripts)

- **`yarn test:api`**: 전체 API 연동 테스트 순차 실행 (로그 확인용)
- **`yarn test:api:ui`**: Vitest UI 도구 브라우저 실행 (**테스트 병렬 실행**, 시각적 디버깅용)
- **`yarn vitest [파일명]`**: 특정 파일만 단독 테스트 실행
- **`yarn gen:types`**: Supabase CLI를 통한 TypeScript 타입 정의 생성
