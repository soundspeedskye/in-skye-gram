import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables, Camelize } from '@/shared/api/types';
import { toCamelCase } from '@/shared/lib/utils/case';

/** 피드 공유 도메인 모델 (자동 변환) */
export type FeedShare = Camelize<Tables<'feed_shares'>>;

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

    return toCamelCase<FeedShare>(data);
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
    return toCamelCase<FeedShare[]>(data);
  },
};
