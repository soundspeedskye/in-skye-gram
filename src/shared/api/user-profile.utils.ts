import { supabase } from './supabase';

/**
 * 랜덤 닉네임 생성
 */
export const generateRandomNickname = () =>
  `user_${Math.random().toString(36).slice(2, 8)}`;

/**
 * 랜덤 프로필 이미지 URL 생성
 */
export const generateRandomProfileImage = () =>
  `https://picsum.photos/50/50?random=${Date.now()}`;

/**
 * 유저 프로필이 없으면 자동 생성하는 헬퍼 함수
 * @param userId - 유저 ID
 */
export const ensureUserProfile = async (userId: string): Promise<void> => {
  // 프로필 존재 여부 확인
  const { data: existingProfile, error: checkError } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(`프로필 확인 실패: ${checkError.message}`);
  }

  // 프로필이 이미 있으면 종료
  if (existingProfile) return;

  // 프로필이 없으면 생성
  const nickname = generateRandomNickname();
  const profileImageUrl = generateRandomProfileImage();

  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert([
      {
        user_id: userId,
        nickname: nickname,
        profile_image_url: profileImageUrl,
      },
    ]);

  if (profileError) {
    throw new Error(`프로필 생성 실패: ${profileError.message}`);
  }
};
