import { supabase } from '@/shared/api/supabase';
import { feedImageStorage } from '@/shared/api/imageStorage';
import { callEdgeFunction } from '@/shared/api/fetchAPI';
import { requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables, Camelize } from '@/shared/api/types';
import { toCamelCase } from '@/shared/lib/utils/case';

// ===== App Model (camelCase) =====

/** 피드 도메인 모델 (자동 변환) */
export type Feed = Camelize<Tables<'feeds'>>;

/** 유저 프로필 요약 (조인용) */
export type UserProfileRow = Pick<Tables<'user_profiles'>, 'nickname' | 'profile_image_url'>;
export type UserProfile = Camelize<UserProfileRow>;

/** 프로필 정보가 포함된 피드 모델 */
export interface FeedWithProfile extends Feed {
  userProfiles: UserProfile;
}

/** DB 레벨의 조인 로우 타입 */
export interface FeedWithProfileRow extends Tables<'feeds'> {
  user_profiles: UserProfileRow | null;
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

/** 
 * 조인된 데이터를 위한 보조 매퍼
 * (구조적 변환은 toCamelCase가 수행하며, 이 함수는 널 가드만 담당)
 */
const transformFeedWithProfile = (row: any): FeedWithProfile => {
  const camelized = toCamelCase<any>(row);
  return {
    ...camelized,
    userProfiles: camelized.userProfiles ?? { nickname: null, profileImageUrl: null },
  };
};

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
    return (data as any[] | null | undefined)?.map(transformFeedWithProfile) ?? [];
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
    return transformFeedWithProfile(data);
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
    return toCamelCase<Feed>(data);
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
    return toCamelCase<Feed[]>(data);
  },
};
