import { supabase } from '@/shared/api/supabase';
import { getCurrentUser, requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables, TablesUpdate } from '@/shared/api/types';

/** 프론트엔드에서 사용하는 유저 프로필 도메인 모델 */
export interface UserProfile {
  userId: string;
  nickname: string | null;
  description: string | null;
  profileImageUrl: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: string;
}

/** DB user_profiles 테이블의 로우 타입 */
export type UserProfileRow = Tables<'user_profiles'>;

/** 프로필 수정을 위한 파라미터 타입 */
export type UpdateProfileParams = {
  nickname?: string | null;
  description?: string | null;
  profileImageUrl?: string | null;
};

export const userProfileAPI = {
  /**
   * 인자로 넘겨진 유저 ID들로 프로필 정보 가져오기
   */
  getUserProfiles: async (userIds: string[]): Promise<UserProfile[]> => {
    if (userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .in('user_id', userIds);

    if (error) throw error;
    return (data as UserProfileRow[] | null | undefined)?.map(mapProfileRowToEntity) ?? [];
  },

  /**
   * 현재 유저의 프로필 정보 가져오기
   */
  getCurrentUserProfile: async (): Promise<UserProfile | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    const row = data as UserProfileRow;
    return mapProfileRowToEntity(row);
  },

  /**
   * 특정 유저 ID로 프로필 정보 가져오기
   */
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    if (!data) return null;

    const row = data as UserProfileRow;
    return mapProfileRowToEntity(row);
  },

  /**
   * 유저 프로필 수정
   */
  updateUserProfile: async (params: UpdateProfileParams): Promise<UserProfile> => {
    const user = await requireCurrentUser();

    const updatePayload: TablesUpdate<'user_profiles'> = {};
    if (params.nickname !== undefined) updatePayload.nickname = params.nickname;
    if (params.description !== undefined) updatePayload.description = params.description;
    if (params.profileImageUrl !== undefined) updatePayload.profile_image_url = params.profileImageUrl;

    if (Object.keys(updatePayload).length === 0) {
      throw new Error('No fields to update');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updatePayload)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Profile update failed');

    return mapProfileRowToEntity(data as UserProfileRow);
  },
};

const mapProfileRowToEntity = (row: UserProfileRow): UserProfile => ({
  userId: row.user_id,
  nickname: row.nickname,
  description: row.description,
  profileImageUrl: row.profile_image_url,
  followerCount: row.follower_count,
  followingCount: row.following_count,
  postCount: row.post_count,
  createdAt: row.created_at,
});
