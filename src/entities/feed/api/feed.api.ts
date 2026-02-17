import { supabase } from '@/shared/api/supabase';
import { feedImageStorage } from '@/shared/api/imageStorage';
import { callEdgeFunction } from '@/shared/api/fetchAPI';
import { requireCurrentUser } from '@/shared/api/auth-utils';
import type {
  Feed,
  FeedWithProfile,
  FeedRow,
  FeedWithProfileRow,
  CreateFeedParams,
  UpdateFeedParams,
  GetFeedsParams,
} from '../model/types';
import { mapFeed, mapFeedWithProfile } from '../model/types';

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
