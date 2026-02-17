import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables } from '@/shared/api/types';

/** 프론트엔드에서 사용하는 피드 공유 도메인 모델 */
export interface FeedShare {
  id: number;
  feedId: number;
  userId: string;
  createdAt: string;
}

/** DB feed_shares 테이블의 로우 타입 */
export type FeedShareRow = Tables<'feed_shares'>;

// ===== Mapping Functions (snake_case -> camelCase) =====

/** DB 공유 로우를 앱 모델로 변환 */
const mapFeedShare = (row: FeedShareRow): FeedShare => ({
  id: row.id,
  feedId: row.feed_id,
  userId: row.user_id,
  createdAt: row.created_at,
});

export const feedShareAPI = {
  /**
   * 피드 공유 추가
   */
  shareFeed: async (feedId: number): Promise<FeedShare> => {
    const user = await requireCurrentUser();

    const { data, error } = await supabase
      .from('feed_shares')
      .insert([{ feed_id: feedId, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    return mapFeedShare(data as FeedShareRow);
  },

  /**
   * 내가 공유한 피드 목록 조회
   */
  getSharedFeeds: async (params: { limit?: number; offset?: number } = {}): Promise<FeedShare[]> => {
    const user = await requireCurrentUser();
    const { limit = 10, offset = 0 } = params;

    const { data, error } = await supabase
      .from('feed_shares')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data as FeedShareRow[] | null | undefined)?.map(mapFeedShare) ?? [];
  },
};
