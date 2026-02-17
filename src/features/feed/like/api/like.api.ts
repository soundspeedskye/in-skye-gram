import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser, getCurrentUser } from '@/shared/api/auth-utils';

export interface FeedLike {
  feedId: number;
  userId: string;
  createdAt: string;
}

export interface FeedLikeRow {
  feed_id: number;
  user_id: string;
  created_at: string;
}

const mapFeedLike = (row: FeedLikeRow): FeedLike => ({
  feedId: row.feed_id,
  userId: row.user_id,
  createdAt: row.created_at,
});

export const feedLikeAPI = {
  /**
   * 피드에 좋아요 추가
   */
  likeFeed: async (feedId: number): Promise<FeedLike> => {
    const user = await requireCurrentUser();

    const { data, error } = await supabase
      .from('feed_likes')
      .insert({
        feed_id: feedId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Already liked this feed');
      }
      throw error;
    }

    return mapFeedLike(data as FeedLikeRow);
  },

  /**
   * 피드 좋아요 취소
   */
  unlikeFeed: async (feedId: number): Promise<void> => {
    const user = await requireCurrentUser();

    const { error } = await supabase
      .from('feed_likes')
      .delete()
      .eq('feed_id', feedId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * 특정 피드에 좋아요 했는지 확인
   */
  isLiked: async (feedId: number): Promise<boolean> => {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('feed_likes')
      .select('feed_id')
      .eq('feed_id', feedId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  },

  /**
   * 여러 피드에 대한 좋아요 여부 확인
   */
  areLiked: async (feedIds: number[]): Promise<Record<number, boolean>> => {
    const user = await getCurrentUser();
    if (!user) return {};

    if (feedIds.length === 0) return {};

    const { data, error } = await supabase
      .from('feed_likes')
      .select('feed_id')
      .eq('user_id', user.id)
      .in('feed_id', feedIds);

    if (error) throw error;

    const result: Record<number, boolean> = {};
    feedIds.forEach((id) => {
      result[id] = false;
    });

    data?.forEach((like) => {
      result[like.feed_id] = true;
    });

    return result;
  },
};
