import { supabase } from '@/shared/api/supabase';
import { getCurrentUser, requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables, TablesUpdate, Camelize } from '@/shared/api/types';
import { toCamelCase } from '@/shared/lib/utils/case';
import { profileImageStorage } from '@/shared/api/imageStorage';

/** 유저 프로필 도메인 모델 (자동 변환) */
export type UserProfile = Camelize<Tables<'user_profiles'>>;

/** 프로필 수정을 위한 파라미터 타입 */
export type UpdateProfileParams = {
  nickname?: string | null;
  description?: string | null;
  profileImageUrl?: string | null;
  profileImageFile?: File;
};

export const userProfileAPI = {
  /**
   * 여러 유저의 프로필 조회
   */
  getUserProfiles: async (userIds: string[]): Promise<UserProfile[]> => {
    if (userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .in('user_id', userIds);

    if (error) throw error;
    return toCamelCase<UserProfile[]>(data);
  },

  /**
   * 본인 프로필 조회
   */
  getCurrentUserProfile: async (): Promise<UserProfile | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return toCamelCase<UserProfile>(data);
  },

  /**
   * 특정 유저 프로필 조회
   */
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return toCamelCase<UserProfile>(data);
  },

  /**
   * 유저 프로필 수정
   */
  updateUserProfile: async (params: UpdateProfileParams): Promise<UserProfile> => {
    const user = await requireCurrentUser();

    const updatePayload: TablesUpdate<'user_profiles'> = {};
    if (params.nickname !== undefined) updatePayload.nickname = params.nickname;
    if (params.description !== undefined) updatePayload.description = params.description;
    
    // 이미지 파일이 직접 전달된 경우 업로드 처리
    if (params.profileImageFile) {
      const publicUrl = await profileImageStorage.upload(user.id, params.profileImageFile);
      updatePayload.profile_image_url = publicUrl;
    } else if (params.profileImageUrl !== undefined) {
      updatePayload.profile_image_url = params.profileImageUrl;
    }

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

    return toCamelCase<UserProfile>(data);
  },
};
