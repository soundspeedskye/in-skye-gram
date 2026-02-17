import { describe, it } from 'vitest';
import { userProfileAPI } from '@/entities/user-profile/api/user-profile.api';
import { followAPI } from '@/features/user/follow/api/follow.api';
import { testLogger, testMatchers, ensureAuth } from './test-helpers';

describe('Profile & Follow Migration Test (Phase 3)', () => {
  testLogger.section('Profile & Follow Integration Test');

  it('should verify profile data and follow functionality', async () => {
    // 1. 인증 보장
    const me = await ensureAuth();
    
    testLogger.step(1, '내 프로필 조회 및 상세 정보 검증 (CamelCase 확인)');
    const myProfile = await userProfileAPI.getCurrentUserProfile();
    testMatchers.expectNotNull(myProfile, '내 프로필 존재 확인');
    
    // CamelCase 필드 검증
    testMatchers.expectNotNull((myProfile as any).userId, 'userId 필드 존재 확인');
    testMatchers.expectBoolean((myProfile as any).user_id === undefined, true, 'snake_case user_id 필드가 없어야 함');
    testLogger.success(`내 닉네임: ${myProfile?.nickname}`);
    
    testLogger.step(2, '타인 프로필 조회 테스트');
    const targetUserId = 'f81ca95d-4cac-48cd-9d3b-9e5848c7198b'; // legacy test ID
    const targetProfile = await userProfileAPI.getUserProfile(targetUserId);
    if (targetProfile) {
      testMatchers.expectEquals(targetProfile.userId, targetUserId, '타인 프로필 조회 확인 (userId)');
      testMatchers.expectBoolean((targetProfile as any).user_id === undefined, true, 'snake_case user_id 필드가 없어야 함');
    }

    testLogger.step(3, '복수 유저 프로필 조회 테스트');
    const profiles = await userProfileAPI.getUserProfiles([me.id]);
    testMatchers.expectLength(profiles, 1, '본인 프로필 복수 조회 확인');
    testMatchers.expectEquals(profiles[0].nickname, myProfile?.nickname, '데이터 일치 확인');

    testLogger.step(4, '팔로우 기능 및 카운트 테스트');
    try {
      // 4.1 초기 팔로우 여부 확인
      const isFollowing = await followAPI.isFollowing(targetUserId);
      testMatchers.expectBoolean(isFollowing, false, '초기 팔로우 상태 (false)');

      // 4.3 팔로우/언팔로우 RPC 호출 테스트
      testLogger.step(5, '팔로우/언팔로우 RPC 호출 테스트');
      await followAPI.follow(targetUserId).catch(e => testLogger.fail('팔로우 실패', e.message));
      await followAPI.unfollow(targetUserId).catch(e => testLogger.fail('언팔로우 실패', e.message));

      testLogger.step(6, '팔로워/팔로잉 목록 및 카운트 조회 (CamelCase 확인)');
      const followers = await followAPI.getFollowers({ limit: 5 });
      if (followers.length > 0) {
        testMatchers.expectNotNull((followers[0] as any).followerId, 'followerId 필드 존재 확인');
        testMatchers.expectBoolean((followers[0] as any).follower_id === undefined, true, 'snake_case follower_id 필드가 없어야 함');
      }

      const counts = await followAPI.getFollowCounts(me.id);
      testMatchers.expectNotNull(counts.followerCount, 'followerCount 필드 존재 확인');
      testMatchers.expectNotNull(counts.followingCount, 'followingCount 필드 존재 확인');
      testMatchers.expectBoolean((counts as any).follower_count === undefined, true, 'snake_case follower_count 필드가 없어야 함');

      testLogger.success('자동 케이스 변환 검증 완료 (UserProfile, Follow)');

    } catch (error: any) {
      testLogger.fail('Profile/Follow 테스트 중 에러 발생', error.message);
      throw error;
    } finally {
      testLogger.step(7, '테스트 데이터 정리 (언팔로우)');
      await followAPI.unfollow(targetUserId).catch(() => {});
      testLogger.success('테스트 데이터 정리 완료');
    }
  });
});
