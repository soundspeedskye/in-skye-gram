import { describe, it } from 'vitest';
import { feedAPI } from '@/entities/feed/api/feed.supabase';
import { supabase } from '@/shared/api/supabase';
import { testLogger, testMatchers, ensureAuth } from './test-helpers';

describe('Feed Upload Integration Test', () => {
  testLogger.section('Feed Image Upload via Edge Function');

  it('should create a feed with real image files', async () => {
    // 1. 인증 보장
    const me = await ensureAuth();

    testLogger.step(1, '테스트용 이미지 파일(Blob) 생성');
    // 빨간색 픽셀 하나짜리 최소 크기 PNG 데이터
    const base64Content = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/png' });
    const file = new File([blob], 'test-image.png', { type: 'image/png' });

    testLogger.step(2, '피드 생성 요청 (이미지 포함)');
    const created = await feedAPI.createFeed({
      caption: 'Testing actual image upload',
      images: [file]
    });

    testMatchers.expectNotNull(created, '피드 생성 결과 확인');
    testMatchers.expectNotNull(created.images, '이미지 URL 리스트 확인');
    testMatchers.expectLength(created.images, 1, '업로드된 이미지 개수 확인');
    
    const imageUrl = created.images[0];
    testLogger.success(`feed.id=${created.id} / 업로드된 이미지 URL: ${imageUrl}`);

    if (imageUrl.includes('picsum.photos')) {
        testLogger.fail('기본 이미지가 반환됨 (업로드 실패 가능성)');
    } else {
        testLogger.success('실제 저장소 URL이 반환됨');
    }

    try {
      testLogger.step(3, '생성된 피드 상세 조회 검증');
      const feed = await feedAPI.getFeed(created.id);
      testMatchers.expectNotNull(feed, '피드 상세 조회 확인');
      testMatchers.expectEquals(feed?.images?.[0], imageUrl, '상세 조회 이미지 URL 일치 확인');

    } finally {
      testLogger.step(4, '테스트 데이터 정리 (피드 삭제)');
      await feedAPI.deleteFeed(created.id);
      testLogger.success('테스트 피드 삭제 완료');

      testLogger.step(5, '스토리지 정리 정합성 확인');
      const path = `${me.id}/feeds/${created.id}`;
      const { data: files } = await supabase.storage.from('uploads').list(path);
      
      if (!files || files.length === 0) {
        testLogger.success('스토리지에서 이미지가 정상적으로 삭제되었습니다.');
      } else {
        testLogger.fail('스토리지에 이미지가 여전히 남아있습니다!', files.map(f => f.name));
      }
    }
  });
});
