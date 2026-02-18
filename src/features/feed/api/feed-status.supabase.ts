import { feedAPI, type FeedWithProfile, type GetFeedsParams } from '@/entities/feed/api/feed.supabase';
import { feedLikeAPI } from '@/features/feed/like/api/like.supabase';
import { feedBookmarkAPI } from '@/features/feed/bookmark/api/bookmark.supabase';

/**
 * 상태(좋아요, 북마크 여부)가 포함된 피드 모델
 */
export interface FeedWithStatus extends FeedWithProfile {
  isLiked: boolean;
  isBookmarked: boolean;
}

export const feedStatusAPI = {
  /**
   * 피드 목록 + 현재 사용자 기준 좋아요/북마크 여부까지 함께 조회
   */
  getFeedsWithStatus: async (params: GetFeedsParams = {}): Promise<FeedWithStatus[]> => {
    const baseFeeds = await feedAPI.getFeeds(params);
    if (baseFeeds.length === 0) return [];

    const feedIds = baseFeeds.map((feed) => feed.id);

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
  getFeedWithStatus: async (feedId: number): Promise<FeedWithStatus | null> => {
    const baseFeed = await feedAPI.getFeed(feedId);
    if (!baseFeed) return null;

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
