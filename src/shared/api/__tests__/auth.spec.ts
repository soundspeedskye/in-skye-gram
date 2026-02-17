import { describe, it } from 'vitest';
import { supabase } from '@/shared/api/supabase';
import { testLogger, testMatchers, ensureAuth } from './test-helpers';

describe('Auth Migration Test (Phase 1)', () => {
  testLogger.section('Auth Migration: Sign In & Profile Auto-generation');

  it('should sign in and ensure profile exists', async () => {
    testLogger.step(1, '성공 가능한 계정인증 보장 (로그인 또는 임시가입)');
    
    const user = await ensureAuth();
    testMatchers.expectNotNull(user, '인증 유저 객체 확인');

    testLogger.step(2, '프로필 생성 여부 확인');
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) throw error;
    testMatchers.expectNotNull(profile, '프로필 데이터 존재 확인');
    testLogger.success('마이그레이션된 Auth 로직 및 프로필 자동 생성 검증 완료', { 
      email: user.email, 
      nickname: profile?.nickname 
    });
  });
});
