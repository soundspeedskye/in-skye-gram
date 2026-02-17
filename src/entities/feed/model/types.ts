import type { Tables } from '@/shared/api/types';

// ===== DB Row (snake_case) =====
export type FeedRow = Tables<'feeds'>;

export type UserProfileRow = {
  nickname: string | null;
  profile_image_url: string | null;
};

export interface FeedWithProfileRow extends FeedRow {
  user_profiles: UserProfileRow;
}

// ===== App Model (camelCase) =====
export interface Feed {
  id: number;
  userId: string;
  images: string[];
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharedCount: number;
  createdAt: string;
  /** 현재 로그인한 사용자가 좋아요 했는지 여부 */
  isLiked?: boolean;
  /** 현재 로그인한 사용자가 북마크 했는지 여부 */
  isBookmarked?: boolean;
}

export interface UserProfile {
  nickname: string | null;
  profileImageUrl: string | null;
}

export interface FeedWithProfile extends Feed {
  userProfiles: UserProfile;
}

export type FeedImageSource =
  | File // Web
  | {
      uri: string; // RN (legacy compatibility)
      name?: string;
      type?: string;
    };

export interface CreateFeedParams {
  caption?: string;
  images?: FeedImageSource[];
}

export interface UpdateFeedParams {
  caption?: string;
}

export interface GetFeedsParams {
  limit?: number;
  offset?: number;
}

// ===== Mapping Functions =====

export const mapUserProfile = (row: UserProfileRow | null | undefined): UserProfile => ({
  nickname: row?.nickname ?? null,
  profileImageUrl: row?.profile_image_url ?? null,
});

export const mapFeed = (row: FeedRow): Feed => ({
  id: row.id,
  userId: row.user_id,
  images: row.images,
  caption: row.caption,
  likesCount: row.likes_count,
  commentsCount: row.comments_count,
  sharedCount: row.shared_count,
  createdAt: row.created_at,
});

export const mapFeedWithProfile = (row: FeedWithProfileRow): FeedWithProfile => ({
  ...mapFeed(row),
  userProfiles: mapUserProfile(row.user_profiles),
});
