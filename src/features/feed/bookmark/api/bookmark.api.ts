import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser, getCurrentUser } from '@/shared/api/auth-utils';

export interface FeedBookmark {
  feedId: number;
  userId: string;
  createdAt: string;
}

export interface FeedBookmarkRow {
  feed_id: number;
  user_id: string;
  created_at: string;
}

const mapFeedBookmark = (row: FeedBookmarkRow): FeedBookmark => ({
  feedId: row.feed_id,
  userId: row.user_id,
  createdAt: row.created_at,
});

export const feedBookmarkAPI = {
  /**
   * 피드 북마크 추가
   */
  bookmarkFeed: async (feedId: number): Promise<FeedBookmark> => {
    const user = await requireCurrentUser();

    const { data, error } = await supabase
      .from('feed_bookmarks')
      .insert({
        feed_id: feedId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Already bookmarked this feed');
      }
      throw error;
    }

    return mapFeedBookmark(data as FeedBookmarkRow);
  },

  /**
   * 피드 북마크 취소
   */
  unbookmarkFeed: async (feedId: number): Promise<void> => {
    const user = await requireCurrentUser();

    const { error } = await supabase
      .from('feed_bookmarks')
      .delete()
      .eq('feed_id', feedId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * 특정 피드에 북마크 했는지 확인
   */
  isBookmarked: async (feedId: number): Promise<boolean> => {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('feed_bookmarks')
      .select('feed_id')
      .eq('feed_id', feedId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  },

  /**
   * 여러 피드에 대한 북마크 여부 확인
   */
  areBookmarked: async (feedIds: number[]): Promise<Record<number, boolean>> => {
    const user = await getCurrentUser();
    if (!user) return {};

    if (feedIds.length === 0) return {};

    const { data, error } = await supabase
      .from('feed_bookmarks')
      .select('feed_id')
      .eq('user_id', user.id)
      .in('feed_id', feedIds);

    if (error) throw error;

    const result: Record<number, boolean> = {};
    feedIds.forEach((id) => {
      result[id] = false;
    });

    data?.forEach((bookmark) => {
      result[bookmark.feed_id] = true;
    });

    return result;
  },
};
