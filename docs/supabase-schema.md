# Instagram Clone – Database Schema (Supabase)

> Supabase 기반 Instagram Clone 프로젝트의 데이터베이스 스키마 정의 문서입니다.  
> 작성 기준: PostgreSQL / Supabase Auth 사용 환경

---

## 목차

1. [ERD 구조 요약](#1-erd-구조-요약)
2. [auth.users](#2-authusers)
3. [user_profiles](#3-user_profiles)
4. [feeds](#4-feeds)
5. [feed_comments](#5-feed_comments)
6. [feed_likes](#6-feed_likes)
7. [feed_bookmarks](#7-feed_bookmarks)
8. [feed_shares](#8-feed_shares)
9. [follows](#9-follows)
10. [Trigger & Function 요약](#10-trigger--function-요약)
11. [설계 핵심 전략](#11-설계-핵심-전략)
12. [Appendix – 전체 DDL](#appendix--전체-ddl)

---

## 1. ERD 구조 요약
```
auth.users
 ├─ public.user_profiles        (1:1)
 ├─ public.feeds                (1:N)
 │   ├─ public.feed_comments    (1:N)
 │   │   └─ public.feed_comments  (대댓글, self reference)
 │   ├─ public.feed_likes       (N:M)
 │   ├─ public.feed_bookmarks   (N:M)
 │   └─ public.feed_shares      (N:M)
 └─ public.follows              (N:M self)
```

---

## 2. auth.users

Supabase Auth에서 자동 관리되는 기본 인증 테이블로, 모든 사용자 관련 테이블의 기준이 된다.

- **PK**: `id (uuid)`
- 직접 수정 불가 (Supabase 내부 관리)

---

## 3. user_profiles

사용자 공개 프로필 정보 및 카운트 캐시를 저장한다.

**관계**: `auth.users (1) ─── (1) user_profiles`

| Column | Type | Description |
|---|---|---|
| `user_id` | uuid PK | `auth.users.id` 참조 (ON DELETE CASCADE) |
| `nickname` | text | 사용자 닉네임 (중복 허용) |
| `description` | text | 사용자 소개글 |
| `profile_image_url` | text | 프로필 이미지 URL |
| `follower_count` | bigint | 팔로워 수 캐시 (default 0) |
| `following_count` | bigint | 팔로잉 수 캐시 (default 0) |
| `post_count` | bigint | 게시물 수 캐시 (default 0) |
| `created_at` | timestamptz | 생성 시각 |

---

## 4. feeds

게시물(피드) 데이터를 저장한다.

**관계**: `auth.users (1) ─── (N) feeds`

| Column | Type | Description |
|---|---|---|
| `id` | bigint PK | 게시물 ID (auto increment) |
| `user_id` | uuid FK | 작성자 (`auth.users`, `user_profiles` 참조) |
| `images` | text[] | 이미지 URL 목록 (default `{}`) |
| `caption` | text | 게시물 본문 (default `''`) |
| `likes_count` | bigint | 좋아요 수 캐시 (default 0) |
| `comments_count` | bigint | 댓글 수 캐시 (default 0) |
| `shared_count` | bigint | 공유 수 캐시 (default 0) |
| `created_at` | timestamptz | 생성 시각 |

**Index**

| Index | Column |
|---|---|
| `idx_feeds_created_at` | `created_at DESC` |
| `idx_feeds_user_id` | `user_id` |

**Trigger**

| Trigger | Event | Description |
|---|---|---|
| `trigger_increment_user_post_count` | AFTER INSERT | `user_profiles.post_count` 증가 |
| `trigger_decrement_user_post_count` | AFTER DELETE | `user_profiles.post_count` 감소 |

---

## 5. feed_comments

댓글 및 대댓글을 단일 테이블로 관리한다. `parent_comment_id IS NULL`이면 일반 댓글, 값이 있으면 대댓글이다.
```
feed_comments
 └── parent_comment_id → feed_comments.id (self reference)
```

| Column | Type | Description |
|---|---|---|
| `id` | bigint PK | 댓글 ID (auto increment) |
| `feed_id` | bigint FK | 대상 게시물 (`feeds.id`, ON DELETE CASCADE) |
| `user_id` | uuid FK | 작성자 (`auth.users`, `user_profiles` 참조) |
| `parent_comment_id` | bigint FK | 부모 댓글 ID (NULL = 일반 댓글) |
| `content` | text | 댓글 내용 |
| `created_at` | timestamptz | 생성 시각 |

**Index**

| Index | Column |
|---|---|
| `idx_feed_comments_feed_id` | `feed_id` |
| `idx_feed_comments_user_id` | `user_id` |
| `idx_feed_comments_parent_id` | `parent_comment_id` |

**Trigger**

| Trigger | Event | Description |
|---|---|---|
| `trigger_increment_feed_comments_count` | AFTER INSERT | `feeds.comments_count` 증가 |
| `trigger_decrement_feed_comments_count` | AFTER DELETE | `feeds.comments_count` 감소 (CASCADE 삭제된 대댓글 자동 처리) |

---

## 6. feed_likes

게시물 좋아요 관계를 저장한다. 동일 사용자의 중복 좋아요는 PK 제약으로 방지한다.

**관계**: `users (N) ─── (N) feeds`  
**PK**: `(feed_id, user_id)`

| Column | Type | Description |
|---|---|---|
| `feed_id` | bigint FK | 좋아요 대상 게시물 |
| `user_id` | uuid FK | 좋아요한 사용자 |
| `created_at` | timestamptz | 좋아요 시각 |

**Trigger**

| Trigger | Event | Description |
|---|---|---|
| `trigger_increment_feed_likes_count` | AFTER INSERT | `feeds.likes_count` 증가 |
| `trigger_decrement_feed_likes_count` | AFTER DELETE | `feeds.likes_count` 감소 |

---

## 7. feed_bookmarks

게시물 북마크를 저장하는 개인 기능 테이블이다. 카운트 캐시는 관리하지 않는다.

**PK**: `(feed_id, user_id)`

| Column | Type | Description |
|---|---|---|
| `feed_id` | bigint FK | 북마크 대상 게시물 |
| `user_id` | uuid FK | 북마크한 사용자 |
| `created_at` | timestamptz | 북마크 시각 |

---

## 8. feed_shares

게시물 공유 이력을 저장한다. 동일 사용자의 중복 공유를 허용하므로 별도 PK(`id`)를 사용한다.

**PK**: `id (bigint, auto increment)`

| Column | Type | Description |
|---|---|---|
| `id` | bigint PK | 공유 ID |
| `feed_id` | bigint FK | 공유된 게시물 |
| `user_id` | uuid FK | 공유한 사용자 |
| `created_at` | timestamptz | 공유 시각 |

**Index**

| Index | Column |
|---|---|
| `idx_feed_shares_feed_id` | `feed_id` |
| `idx_feed_shares_user_id` | `user_id` |

**Trigger**

| Trigger | Event | Description |
|---|---|---|
| `trigger_increment_feed_shared_count` | AFTER INSERT | `feeds.shared_count` 증가 (삭제 Trigger 없음) |

---

## 9. follows

사용자 간 팔로우/팔로잉 관계를 저장한다. 동일 사용자 간 중복 팔로우는 PK 제약으로 방지한다.

**관계**: `users (N) ─── (N) users (self)`  
**PK**: `(follower_id, following_id)`

| Column | Type | Description |
|---|---|---|
| `follower_id` | uuid FK | 팔로우를 하는 사용자 |
| `following_id` | uuid FK | 팔로우 대상 사용자 |
| `created_at` | timestamptz | 팔로우 시각 |

**Index**

| Index | Column |
|---|---|
| `idx_follows_following_id` | `following_id` |

**RPC 함수**

| Function | Description |
|---|---|
| `follow_user(target_user_id)` | 팔로우 처리 + `following_count` / `follower_count` 증가 |
| `unfollow_user(target_user_id)` | 언팔로우 처리 + `following_count` / `follower_count` 감소 |

> 두 함수 모두 `SECURITY DEFINER`로 정의되며 `auth.uid()`를 통해 현재 사용자를 식별한다.

---

## 10. Trigger & Function 요약

| Table | Function | Trigger | Event |
|---|---|---|---|
| `feeds` | `increment_user_post_count` | `trigger_increment_user_post_count` | AFTER INSERT |
| `feeds` | `decrement_user_post_count` | `trigger_decrement_user_post_count` | AFTER DELETE |
| `feed_comments` | `increment_feed_comments_count` | `trigger_increment_feed_comments_count` | AFTER INSERT |
| `feed_comments` | `decrement_feed_comments_count` | `trigger_decrement_feed_comments_count` | AFTER DELETE |
| `feed_likes` | `increment_feed_likes_count` | `trigger_increment_feed_likes_count` | AFTER INSERT |
| `feed_likes` | `decrement_feed_likes_count` | `trigger_decrement_feed_likes_count` | AFTER DELETE |
| `feed_shares` | `increment_feed_shared_count` | `trigger_increment_feed_shared_count` | AFTER INSERT |

---

## 11. 설계 핵심 전략

### 캐시 컬럼 사용

빈번하게 조회되는 집계값을 별도 컬럼에 캐싱하여 `COUNT` 쿼리를 제거하고 읽기 성능을 최적화한다.

| 캐시 컬럼 | 위치 |
|---|---|
| `post_count` | `user_profiles` |
| `follower_count` | `user_profiles` |
| `following_count` | `user_profiles` |
| `likes_count` | `feeds` |
| `comments_count` | `feeds` |
| `shared_count` | `feeds` |

### Trigger 기반 자동 동기화

캐시 컬럼 업데이트를 DB Trigger로 처리하여 Application Layer에서의 수동 업데이트 의존성을 제거한다. 데이터 정합성을 DB 수준에서 보장한다.

### Self Reference 구조

단일 테이블로 계층 관계를 표현한다.

| 구조 | 테이블 | 컬럼 |
|---|---|---|
| 댓글/대댓글 | `feed_comments` | `parent_comment_id` |
| 팔로우 관계 | `follows` | `follower_id` ↔ `following_id` |

### Supabase Client 관계 매핑용 FK

Supabase JS Client의 자동 Join 기능 활용을 위해 `user_profiles`를 경유하는 추가 FK를 일부 테이블에 정의한다.

---

## Appendix – 전체 DDL

### user_profiles
```sql
CREATE TABLE public.user_profiles (
    user_id uuid PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname text NOT NULL,
    description text,
    profile_image_url text NOT NULL,
    follower_count bigint NOT NULL DEFAULT 0,
    following_count bigint NOT NULL DEFAULT 0,
    post_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

---

### feeds
```sql
CREATE TABLE public.feeds (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    images text[] NOT NULL DEFAULT '{}',
    caption text NOT NULL DEFAULT '',
    likes_count bigint NOT NULL DEFAULT 0,
    comments_count bigint NOT NULL DEFAULT 0,
    shared_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feeds_created_at ON feeds(created_at DESC);
CREATE INDEX idx_feeds_user_id ON feeds(user_id);

ALTER TABLE public.feeds
    ADD CONSTRAINT feeds_user_id_profile_fkey
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE;
```

**Trigger – post_count**
```sql
-- 증가
CREATE OR REPLACE FUNCTION increment_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles SET post_count = post_count + 1 WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_user_post_count
    AFTER INSERT ON feeds
    FOR EACH ROW EXECUTE FUNCTION increment_user_post_count();

-- 감소
CREATE OR REPLACE FUNCTION decrement_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles SET post_count = GREATEST(post_count - 1, 0) WHERE user_id = OLD.user_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_user_post_count
    AFTER DELETE ON feeds
    FOR EACH ROW EXECUTE FUNCTION decrement_user_post_count();
```

---

### feed_comments
```sql
CREATE TABLE public.feed_comments (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    feed_id bigint NOT NULL
        REFERENCES public.feeds(id) ON DELETE CASCADE,
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_comment_id bigint
        REFERENCES public.feed_comments(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feed_comments_feed_id ON feed_comments(feed_id);
CREATE INDEX idx_feed_comments_user_id ON feed_comments(user_id);
CREATE INDEX idx_feed_comments_parent_id ON feed_comments(parent_comment_id);

ALTER TABLE public.feed_comments
    ADD CONSTRAINT feed_comments_user_id_profile_fkey
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id);
```

**Trigger – comments_count**
```sql
-- 증가
CREATE OR REPLACE FUNCTION increment_feed_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE feeds SET comments_count = comments_count + 1 WHERE id = NEW.feed_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_feed_comments_count
    AFTER INSERT ON feed_comments
    FOR EACH ROW EXECUTE FUNCTION increment_feed_comments_count();

-- 감소
CREATE OR REPLACE FUNCTION decrement_feed_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE feeds SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.feed_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_feed_comments_count
    AFTER DELETE ON feed_comments
    FOR EACH ROW EXECUTE FUNCTION decrement_feed_comments_count();
```

---

### feed_likes
```sql
CREATE TABLE public.feed_likes (
    feed_id bigint NOT NULL
        REFERENCES public.feeds(id) ON DELETE CASCADE,
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (feed_id, user_id)
);
```

**Trigger – likes_count**
```sql
-- 증가
CREATE OR REPLACE FUNCTION increment_feed_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE feeds SET likes_count = likes_count + 1 WHERE id = NEW.feed_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_feed_likes_count
    AFTER INSERT ON feed_likes
    FOR EACH ROW EXECUTE FUNCTION increment_feed_likes_count();

-- 감소
CREATE OR REPLACE FUNCTION decrement_feed_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE feeds SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.feed_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_feed_likes_count
    AFTER DELETE ON feed_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_feed_likes_count();
```

---

### feed_bookmarks
```sql
CREATE TABLE public.feed_bookmarks (
    feed_id bigint NOT NULL
        REFERENCES public.feeds(id) ON DELETE CASCADE,
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (feed_id, user_id)
);
```

---

### feed_shares
```sql
CREATE TABLE public.feed_shares (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    feed_id bigint NOT NULL
        REFERENCES public.feeds(id) ON DELETE CASCADE,
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feed_shares_feed_id ON feed_shares(feed_id);
CREATE INDEX idx_feed_shares_user_id ON feed_shares(user_id);
```

**Trigger – shared_count**
```sql
CREATE OR REPLACE FUNCTION increment_feed_shared_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE feeds SET shared_count = shared_count + 1 WHERE id = NEW.feed_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_feed_shared_count
    AFTER INSERT ON feed_shares
    FOR EACH ROW EXECUTE FUNCTION increment_feed_shared_count();
```

---

### follows
```sql
CREATE TABLE public.follows (
    follower_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX idx_follows_following_id ON follows(following_id);

ALTER TABLE public.follows
    ADD CONSTRAINT follows_follower_profile_fkey
    FOREIGN KEY (follower_id) REFERENCES public.user_profiles(user_id);

ALTER TABLE public.follows
    ADD CONSTRAINT follows_following_profile_fkey
    FOREIGN KEY (following_id) REFERENCES public.user_profiles(user_id);
```

**RPC – follow_user / unfollow_user**
```sql
-- 팔로우
CREATE OR REPLACE FUNCTION follow_user(target_user_id UUID)
RETURNS void AS $$
DECLARE
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN RAISE EXCEPTION 'User not authenticated'; END IF;
    IF current_user_id = target_user_id THEN RAISE EXCEPTION 'Cannot follow yourself'; END IF;

    INSERT INTO follows (follower_id, following_id) VALUES (current_user_id, target_user_id);
    UPDATE user_profiles SET following_count = following_count + 1 WHERE user_id = current_user_id;
    UPDATE user_profiles SET follower_count = follower_count + 1 WHERE user_id = target_user_id;
EXCEPTION
    WHEN unique_violation THEN RAISE EXCEPTION 'Already following this user';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 언팔로우
CREATE OR REPLACE FUNCTION unfollow_user(target_user_id UUID)
RETURNS void AS $$
DECLARE
    current_user_id UUID;
    deleted_count INTEGER;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN RAISE EXCEPTION 'User not authenticated'; END IF;

    DELETE FROM follows WHERE follower_id = current_user_id AND following_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    IF deleted_count = 0 THEN RAISE EXCEPTION 'Not following this user'; END IF;

    UPDATE user_profiles SET following_count = GREATEST(following_count - 1, 0) WHERE user_id = current_user_id;
    UPDATE user_profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```