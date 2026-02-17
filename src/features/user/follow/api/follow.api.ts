import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser, getCurrentUser } from '@/shared/api/auth-utils';
import type { Tables } from '@/shared/api/types';

/** 프론트엔드에서 사용하는 팔로우 도메인 모델 */
export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

/** DB follows 테이블의 로우 타입 */
export type FollowRow = Tables<'follows'>;

/** 조인을 위한 user_profiles 테이블의 부분 타입 */
export type FollowProfileRow = Pick<Tables<'user_profiles'>, 'user_id' | 'nickname' | 'profile_image_url'>;

/** 프론트엔드에서 사용하는 팔로우 프로필 정보 모델 */
export interface FollowProfile {
  userId: string;
  nickname: string | null;
  profileImageUrl: string | null;
}

/** 프로필 정보가 포함된 팔로우 모델 */
export interface FollowWithProfile extends Follow {
  followerProfile: FollowProfile;
  followingProfile: FollowProfile;
}

/** user_profiles가 조인된 팔로우 로우 타입 */
export interface FollowWithProfileRow extends FollowRow {
  follower_profile: FollowProfileRow | null;
  following_profile: FollowProfileRow | null;
}

export interface GetFollowsParams {
  limit?: number;
  offset?: number;
}

export interface FollowCounts {
  followerCount: number;
  followingCount: number;
}

// ===== Mapping Functions (snake_case -> camelCase) =====

/** DB 팔로우 로우를 앱 모델로 변환 */
const mapFollow = (row: FollowRow): Follow => ({
  followerId: row.follower_id,
  followingId: row.following_id,
  createdAt: row.created_at,
});

/** DB 프로필 로우를 앱 모델로 변환 */
const mapFollowProfile = (row: FollowProfileRow | null | undefined): FollowProfile => ({
  userId: row?.user_id ?? '',
  nickname: row?.nickname ?? null,
  profileImageUrl: row?.profile_image_url ?? null,
});

/** 조인된 팔로우 로우를 프로필 정보가 포함된 앱 모델로 변환 */
const mapFollowWithProfile = (row: FollowWithProfileRow): FollowWithProfile => ({
  ...mapFollow(row),
  followerProfile: mapFollowProfile(row.follower_profile),
  followingProfile: mapFollowProfile(row.following_profile),
});

export const followAPI = {
  /**
   * 유저 팔로우 (RPC 호출)
   */
  follow: async (userId: string): Promise<void> => {
    const { error } = await supabase.rpc('follow_user', {
      target_user_id: userId,
    });

    if (error) {
      if (error.message.includes('Already following')) {
        throw new Error('Already following this user');
      }
      if (error.message.includes('Cannot follow yourself')) {
        throw new Error('Cannot follow yourself');
      }
      throw error;
    }
  },

  /**
   * 유저 언팔로우 (RPC 호출)
   */
  unfollow: async (userId: string): Promise<void> => {
    const { error } = await supabase.rpc('unfollow_user', {
      target_user_id: userId,
    });

    if (error) {
      if (error.message.includes('Not following')) {
        throw new Error('Not following this user');
      }
      throw error;
    }
  },

  /**
   * 특정 유저를 팔로우 하고 있는지 확인
   */
  isFollowing: async (userId: string): Promise<boolean> => {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  /**
   * 여러 유저에 대한 팔로우 여부 확인
   */
  areFollowing: async (userIds: string[]): Promise<Record<string, boolean>> => {
    const user = await getCurrentUser();
    if (!user) return {};

    if (userIds.length === 0) return {};

    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)
      .in('following_id', userIds);

    if (error) throw error;

    const result: Record<string, boolean> = {};
    userIds.forEach((id) => {
      result[id] = false;
    });

    data?.forEach((follow) => {
      result[follow.following_id] = true;
    });

    return result;
  },

  /**
   * 내 팔로워 목록 조회
   */
  getFollowers: async (params: GetFollowsParams = {}): Promise<FollowWithProfile[]> => {
    const user = await requireCurrentUser();
    const { limit = 10, offset = 0 } = params;

    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        *,
        follower_profile:user_profiles!follows_follower_profile_fkey (
          user_id,
          nickname,
          profile_image_url
        )
      `
      )
      .eq('following_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data as any[] | null | undefined)?.map((row) => mapFollowWithProfile(row as any)) ?? [];
  },

  /**
   * 내가 팔로우하는 사람 목록 조회
   */
  getFollowings: async (params: GetFollowsParams = {}): Promise<FollowWithProfile[]> => {
    const user = await requireCurrentUser();
    const { limit = 10, offset = 0 } = params;

    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        *,
        following_profile:user_profiles!follows_following_profile_fkey (
          user_id,
          nickname,
          profile_image_url
        )
      `
      )
      .eq('follower_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data as any[] | null | undefined)?.map((row) => mapFollowWithProfile(row as any)) ?? [];
  },

  /**
   * 특정 유저의 팔로워 수, 팔로잉 수 조회
   */
  getFollowCounts: async (userId?: string): Promise<FollowCounts> => {
    let targetUserId = userId;

    if (!targetUserId) {
      const user = await requireCurrentUser();
      targetUserId = user.id;
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('follower_count, following_count')
      .eq('user_id', targetUserId)
      .single();

    if (error) throw error;

    return {
      followerCount: profile.follower_count,
      followingCount: profile.following_count,
    };
  },
};
