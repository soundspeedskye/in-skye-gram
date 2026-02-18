import { describe, it, vi } from 'vitest';
import { userProfileAPI } from '@/entities/user-profile/api/user-profile.supabase';
import { profileImageStorage } from '@/shared/api/imageStorage';
import { testLogger, testMatchers, ensureAuth } from './test-helpers';

describe('Profile Update Integration Test', () => {
  testLogger.section('Profile Update Integration Test');

  it('should update profile fields and upload image', async () => {
    // 1. 인증 보장
    const me = await ensureAuth();

    // 덮어쓰기 권한 문제 방지를 위해 테스트 시에는 고유한 파일명 사용
    const uniqueFileName = `test_profile_${Date.now()}.png`;
    vi.spyOn(profileImageStorage, 'getProfileImagePath').mockReturnValue(`${me.id}/profile/${uniqueFileName}`);
    
    testLogger.step(1, '초기 프로필 데이터 조회 (CamelCase 확인)');
    const initialProfile = await userProfileAPI.getCurrentUserProfile();
    testMatchers.expectNotNull(initialProfile, '초기 프로필 존재 확인');
    
    // CamelCase 필드 검증
    testMatchers.expectNotNull((initialProfile as any).userId, 'userId 필드 존재 확인');
    testMatchers.expectBoolean((initialProfile as any).user_id === undefined, true, 'snake_case user_id 필드가 없어야 함');

    const originalNickname = initialProfile?.nickname;

    testLogger.step(2, '텍스트 필드 수정 (닉네임, 소개)');
    const newNickname = `tester_${Math.random().toString(36).substring(7)}`;
    const newDescription = 'This is a test description';
    
    const updatedProfile = await userProfileAPI.updateUserProfile({
      nickname: newNickname,
      description: newDescription,
    });

    testMatchers.expectEquals(updatedProfile.nickname, newNickname, '닉네임 수정 확인');
    testMatchers.expectEquals(updatedProfile.description, newDescription, '소개 수정 확인');
    testMatchers.expectBoolean((updatedProfile as any).profile_image_url === undefined, true, 'snake_case profile_image_url 필드가 없어야 함');

    testLogger.step(3, '프로필 이미지 업로드 테스트');
    // 테스트용 가상 이미지 파일 생성 (Blob -> File)
    const content = 'fake-image-content';
    const blob = new Blob([content], { type: 'image/png' });
    const file = new File([blob], 'test-profile.png', { type: 'image/png' });

    const profileWithImage = await userProfileAPI.updateUserProfile({
      profileImageFile: file,
    });

    testMatchers.expectNotNull(profileWithImage.profileImageUrl, '업로드된 이미지 URL 확인');
    if (profileWithImage.profileImageUrl) {
      testMatchers.expectBoolean(
        profileWithImage.profileImageUrl.includes(uniqueFileName),
        true,
        '이미지 경로 패턴 확인 (모킹된 파일명 포함 여부)'
      );
    }

    testLogger.step(4, '원상 복구 및 최종 확인');
    const restoredProfile = await userProfileAPI.updateUserProfile({
      nickname: originalNickname,
    });
    testMatchers.expectEquals(restoredProfile.nickname, originalNickname, '프로필 복구 확인');

    testLogger.success('프로필 수정 및 이미지 업로드 통합 테스트 완료');
  });
});
