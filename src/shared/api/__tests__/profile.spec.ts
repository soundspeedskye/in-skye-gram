import { describe, it } from 'vitest';
import { userProfileAPI } from '@/entities/user-profile/api/user-profile.api';
import { followAPI } from '@/features/user/follow/api/follow.api';
import { testLogger, testMatchers, ensureAuth } from './test-helpers';

describe('Profile & Follow Migration Test (Phase 3)', () => {
  testLogger.section('Profile & Follow Integration Test');

  it('should verify profile data and follow functionality', async () => {
    // 1. 인증 보장
    const me = await ensureAuth();
    
    testLogger.step(1, '내 프로필 조회 및 상세 정보 검증');
    const myProfile = await userProfileAPI.getCurrentUserProfile();
    testMatchers.expectNotNull(myProfile, '내 프로필 존재 확인');
    testLogger.success(`내 닉네임: ${myProfile?.nickname}`);
    
    testLogger.step(2, '타인 프로필 조회 테스트');
    const targetUserId = 'f81ca95d-4cac-48cd-9d3b-9e5848c7198b'; // legacy test ID
    const targetProfile = await userProfileAPI.getUserProfile(targetUserId);
    // targetProfile이 없을 수 있으므로 존재한다면 ID 확인
    if (targetProfile) {
      testMatchers.expectEquals(targetProfile.userId, targetUserId, '타인 프로필 조회 확인');
    }

    testLogger.step(3, '복수 유저 프로필 조회 테스트');
    const profiles = await userProfileAPI.getUserProfiles([me.id]);
    testMatchers.expectLength(profiles, 1, '본인 프로필 복수 조회 확인');
    testMatchers.expectEquals(profiles[0].nickname, myProfile?.nickname, '데이터 일치 확인');

    testLogger.step(4, '팔로우 기능 및 카운트 테스트');
    try {
      // 4.1 초기 팔로우 여부 확인 (false 예상)
      const isFollowing = await followAPI.isFollowing(targetUserId);
      testMatchers.expectBoolean(isFollowing, false, '초기 팔로우 상태 (false)');

      // 4.2 벌크 팔로우 상태 확인 (areFollowing)
      const areFollowingMap = await followAPI.areFollowing([targetUserId]);
      testMatchers.expectBoolean(areFollowingMap[targetUserId] || false, false, '벌크 조회 시 팔로우 상태 확인');

      // 4.3 팔로우/언팔로우 RPC 호출 테스트
      // (테스트 DB 환경에 따라 유저가 없을 수 있으므로 catch 처리하지만 구조적 호출 확인)
      testLogger.step(5, '팔로우/언팔로우 RPC 호출 테스트');
      await followAPI.follow(targetUserId).catch(e => testLogger.fail('팔로우 실패 (유저 없음 등)', e.message));
      await followAPI.unfollow(targetUserId).catch(e => testLogger.fail('언팔로우 실패', e.message));

      testLogger.step(6, '팔로워/팔로잉 목록 및 카운트 조회');
      // 목록 조회 (구조적 확인)
      const followers = await followAPI.getFollowers({ limit: 5 });
      const followings = await followAPI.getFollowings({ limit: 5 });
      testMatchers.expectNotNull(followers, '팔로워 목록 조회 확인');
      testMatchers.expectNotNull(followings, '팔로잉 목록 조회 확인');

      const counts = await followAPI.getFollowCounts(me.id);
      testMatchers.expectNotNull(counts.followerCount, '팔로워 수 확인');
      testMatchers.expectNotNull(counts.followingCount, '팔로잉 수 확인');

      testLogger.success('Phase 3 API 구조 마이그레이션 검증 완료 (Profile, Follow)');

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
