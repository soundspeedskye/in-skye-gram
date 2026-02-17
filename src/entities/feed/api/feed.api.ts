import { supabase } from '@/shared/api/supabase';
import { feedImageStorage } from '@/shared/api/imageStorage';
import { callEdgeFunction } from '@/shared/api/fetchAPI';
import { requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables } from '@/shared/api/types';

// ===== DB Row (snake_case) =====
/** DB feeds 테이블의 로우 타입 */
export type FeedRow = Tables<'feeds'>;

/** 조인을 위한 user_profiles 테이블의 부분 타입 */
export type UserProfileRow = Pick<Tables<'user_profiles'>, 'nickname' | 'profile_image_url'>;

/** user_profiles가 조인된 피드 로우 타입 */
export interface FeedWithProfileRow extends FeedRow {
  user_profiles: UserProfileRow | null;
}

// ===== App Model (camelCase) =====
/** 프론트엔드에서 사용하는 피드 도메인 모델 */
export interface Feed {
  id: number;
  userId: string;
  images: string[];
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharedCount: number;
  createdAt: string;
  /** 현재 로그인한 사용자가 좋아요 했는지 여부 (클라이언트 상태 매핑) */
  isLiked?: boolean;
  /** 현재 로그인한 사용자가 북마크 했는지 여부 (클라이언트 상태 매핑) */
  isBookmarked?: boolean;
}

/** 프론트엔드에서 사용하는 유저 프로필 요약 모델 */
export interface UserProfile {
  nickname: string | null;
  profileImageUrl: string | null;
}

/** 프로필 정보가 포함된 피드 모델 */
export interface FeedWithProfile extends Feed {
  userProfiles: UserProfile;
}

/** 이미지 업로드 시 지원하는 소스 타입 (Web File 또는 RN URI) */
export type FeedImageSource =
  | File
  | {
      uri: string;
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

// ===== Mapping Functions (snake_case -> camelCase) =====

/** DB 프로필 로우를 앱 모델로 변환 */
export const mapUserProfile = (row: UserProfileRow | null | undefined): UserProfile => ({
  nickname: row?.nickname ?? null,
  profileImageUrl: row?.profile_image_url ?? null,
});

/** DB 피드 로우를 앱 모델로 변환 (모델 기준 snake -> camel) */
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

/** 조인된 피드 로우를 프로필 정보가 포함된 앱 모델로 변환 */
export const mapFeedWithProfile = (row: FeedWithProfileRow): FeedWithProfile => ({
  ...mapFeed(row),
  userProfiles: mapUserProfile(row.user_profiles),
});

export const feedAPI = {
  /**
   * 피드 목록 조회 (무한 스크롤용)
   */
  getFeeds: async (params: GetFeedsParams = {}): Promise<FeedWithProfile[]> => {
    const { limit = 10, offset = 0 } = params;

    const { data, error } = await supabase
      .from('feeds')
      .select(
        `
        *,
        user_profiles(
          nickname,
          profile_image_url
        )
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data as FeedWithProfileRow[] | null | undefined)?.map(mapFeedWithProfile) ?? [];
  },

  /**
   * 특정 피드 조회
   */
  getFeed: async (feedId: number): Promise<FeedWithProfile | null> => {
    const { data, error } = await supabase
      .from('feeds')
      .select(
        `
        *,
        user_profiles(
          nickname,
          profile_image_url
        )
      `
      )
      .eq('id', feedId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    if (!data) return null;
    return mapFeedWithProfile(data as FeedWithProfileRow);
  },

  /**
   * 피드 생성 (Edge Function 호출)
   */
  createFeed: async (params: CreateFeedParams): Promise<Feed> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      throw new Error('Unauthorized');
    }

    const formData = new FormData();

    if (params.caption) {
      formData.append('caption', params.caption);
    }

    if (params.images) {
      for (const image of params.images) {
        if (image instanceof File) {
          formData.append('images', image);
        } else {
            // legacy RN compatibility
          formData.append('images', {
            uri: image.uri,
            name: image.name ?? 'image.jpg',
            type: image.type ?? 'image/jpeg',
          } as any);
        }
      }
    }

    return callEdgeFunction<Feed>('/functions/v1/create-feed', formData, accessToken);
  },

  /**
   * 피드 수정
   */
  updateFeed: async (feedId: number, params: UpdateFeedParams): Promise<Feed> => {
    const user = await requireCurrentUser();

    // 본인 피드인지 확인
    const { data: existingFeed, error: fetchError } = await supabase
      .from('feeds')
      .select('user_id')
      .eq('id', feedId)
      .single();

    if (fetchError) throw fetchError;
    if ((existingFeed as { user_id: string }).user_id !== user.id) {
      throw new Error('Not authorized to update this feed');
    }

    const { data, error } = await supabase
      .from('feeds')
      .update(params)
      .eq('id', feedId)
      .select()
      .single();

    if (error) throw error;
    return mapFeed(data as FeedRow);
  },

  /**
   * 피드 삭제
   */
  deleteFeed: async (feedId: number): Promise<void> => {
    const user = await requireCurrentUser();

    // 본인 피드인지 확인
    const { data: existingFeed, error: fetchError } = await supabase
      .from('feeds')
      .select('id, user_id')
      .eq('id', feedId)
      .single();

    if (fetchError) throw fetchError;
    if (existingFeed.user_id !== user.id) {
      throw new Error('Not authorized to delete this feed');
    }

    // DB 삭제
    const { error: deleteError } = await supabase.from('feeds').delete().eq('id', feedId);

    if (deleteError) throw deleteError;

    // 이미지 삭제 (완료 대기)
    await feedImageStorage.removeAll(user.id, feedId);
  },

  /**
   * 내 피드 목록 조회
   */
  getMyFeeds: async (params: GetFeedsParams = {}): Promise<Feed[]> => {
    const user = await requireCurrentUser();
    const { limit = 10, offset = 0 } = params;

    const { data, error } = await supabase
      .from('feeds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

      if (error) throw error;
    return (data as FeedRow[] | null | undefined)?.map(mapFeed) ?? [];
  },

  /**
   * 피드 목록 + 현재 사용자 기준 좋아요/북마크 여부까지 함께 조회
   */
  getFeedsWithStatus: async (params: GetFeedsParams = {}): Promise<FeedWithProfile[]> => {
    const baseFeeds = await feedAPI.getFeeds(params);
    if (baseFeeds.length === 0) return baseFeeds;

    const feedIds = baseFeeds.map((feed) => feed.id);

    const { feedLikeAPI } = await import('@/features/feed/like/api/like.api');
    const { feedBookmarkAPI } = await import('@/features/feed/bookmark/api/bookmark.api');

    const [likedMap, bookmarkedMap] = await Promise.all([
      feedLikeAPI.areLiked(feedIds),
      feedBookmarkAPI.areBookmarked(feedIds),
    ]);

    return baseFeeds.map((feed) => ({
      ...feed,
      isLiked: !!likedMap[feed.id],
      isBookmarked: !!bookmarkedMap[feed.id],
    }));
  },

  /**
   * 단일 피드 + 현재 사용자 기준 좋아요/북마크 여부까지 함께 조회
   */
  getFeedWithStatus: async (feedId: number): Promise<FeedWithProfile | null> => {
    const baseFeed = await feedAPI.getFeed(feedId);
    if (!baseFeed) return null;

    const { feedLikeAPI } = await import('@/features/feed/like/api/like.api');
    const { feedBookmarkAPI } = await import('@/features/feed/bookmark/api/bookmark.api');

    const [isLiked, isBookmarked] = await Promise.all([
      feedLikeAPI.isLiked(feedId),
      feedBookmarkAPI.isBookmarked(feedId),
    ]);

    return {
      ...baseFeed,
      isLiked,
      isBookmarked,
    };
  },
};
