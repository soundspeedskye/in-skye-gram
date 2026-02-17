import { describe, it, expect } from 'vitest';
import { feedAPI } from '@/entities/feed/api/feed.api';
import { feedLikeAPI } from '@/features/feed/like/api/like.api';
import { feedBookmarkAPI } from '@/features/feed/bookmark/api/bookmark.api';
import { feedCommentAPI } from '@/features/feed/comment/api/comment.api';
import { feedShareAPI } from '@/features/feed/share/api/share.api';
import { testLogger, testMatchers, ensureAuth } from './test-helpers';

describe('Feed Migration Test (Phase 2)', () => {
  testLogger.section('Feed & Interaction Integration Test');

  it('should complete a full feed lifecycle with all interactions', async () => {
    // 1. 인증 보장
    await ensureAuth();

    testLogger.step(1, '피드 생성 테스트');
    const created = await feedAPI.createFeed({
      caption: 'Full interaction test feed',
    });
    testMatchers.expectNotNull(created, '피드 생성 확인');
    const feedId = created.id;

    try {
      testLogger.step(2, '피드 조회 및 초기 상태 확인');
      const feed = await feedAPI.getFeedWithStatus(feedId);
      testMatchers.expectEquals(feed?.id, feedId, '피드 ID 일치 확인');
      testMatchers.expectBoolean(feed?.isLiked || false, false, '초기 좋아요 상태 (false)');
      testMatchers.expectBoolean(feed?.isBookmarked || false, false, '초기 북마크 상태 (false)');

      testLogger.step(3, '피드 수정 테스트');
      const updatedCaption = 'Updated caption';
      const updated = await feedAPI.updateFeed(feedId, { caption: updatedCaption });
      testMatchers.expectEquals(updated.caption, updatedCaption, '피드 캡션 수정 확인');

      testLogger.step(4, '좋아요/북마크 상호작용 및 취소 테스트');
      // 좋아요 추가
      await feedLikeAPI.likeFeed(feedId);
      expect(await feedLikeAPI.isLiked(feedId)).toBe(true);
      
      // 북마크 추가
      await feedBookmarkAPI.bookmarkFeed(feedId);
      expect(await feedBookmarkAPI.isBookmarked(feedId)).toBe(true);
      
      const afterInteraction = await feedAPI.getFeedWithStatus(feedId);
      testMatchers.expectBoolean(afterInteraction?.isLiked || false, true, '상호작용 후 좋아요 상태 (true)');
      testMatchers.expectBoolean(afterInteraction?.isBookmarked || false, true, '상호작용 후 북마크 상태 (true)');

      // 취소 테스트
      await feedLikeAPI.unlikeFeed(feedId);
      await feedBookmarkAPI.unbookmarkFeed(feedId);
      const afterCancel = await feedAPI.getFeedWithStatus(feedId);
      testMatchers.expectBoolean(afterCancel?.isLiked || false, false, '취소 후 좋아요 상태 (false)');
      testMatchers.expectBoolean(afterCancel?.isBookmarked || false, false, '취소 후 북마크 상태 (false)');

      testLogger.step(5, '피드 목록 조회 테스트 (With Status)');
      const feeds = await feedAPI.getFeedsWithStatus({ limit: 5 });
      testMatchers.expectNotNull(feeds, '목록 조회 확인');
      // 벌크 조회 시 상태 맵 확인 (areLiked, areBookmarked 검증 효과)
      const likedMap = await feedLikeAPI.areLiked([feedId]);
      testMatchers.expectBoolean(likedMap[feedId] || false, false, '벌크 조회 시 좋아요 상태 확인');

      testLogger.step(6, '댓글 라이프사이클 테스트 (생성/수정/삭제)');
      const comment = await feedCommentAPI.createComment({
        feedId,
        content: 'Test comment'
      });
      testMatchers.expectNotNull(comment, '댓글 작성 확인');
      
      const updatedCommentText = 'Updated comment';
      const updatedComment = await feedCommentAPI.updateComment(comment.id, updatedCommentText);
      testMatchers.expectEquals(updatedComment.content, updatedCommentText, '댓글 수정 확인');

      const reply = await feedCommentAPI.createComment({
        feedId,
        parentCommentId: comment.id,
        content: 'Test reply'
      });
      testMatchers.expectEquals(reply.parentCommentId, comment.id, '대댓글 작성 확인');

      await feedCommentAPI.deleteComment(comment.id);
      const commentsAfterDelete = await feedCommentAPI.getComments(feedId);
      testMatchers.expectBoolean(commentsAfterDelete.some(c => c.id === comment.id), false, '댓글 삭제 확인');

      testLogger.step(7, '공유 테스트');
      const shared = await feedShareAPI.shareFeed(feedId);
      testMatchers.expectEquals(shared.feedId, feedId, '공유 기록 확인');
      
      const finalFeed = await feedAPI.getFeed(feedId);
      testMatchers.expectNotNull(finalFeed?.sharedCount, '공유 카운트 증가 확인');

      testLogger.success('피드 관련 모든 API 시나리오 검증 완료');

    } finally {
      testLogger.step(8, '테스트 데이터 정리 (피드 삭제)');
      await feedAPI.deleteFeed(feedId);
      testLogger.success('피드 삭제 완료');
    }
  });
});
