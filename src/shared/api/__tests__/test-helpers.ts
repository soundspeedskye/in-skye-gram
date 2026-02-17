import { expect } from 'vitest';
import { supabase } from '../supabase';
import { ensureUserProfile } from '../user-profile.utils';

/**
 * 테스트 단계 및 결과 로깅을 위한 헬퍼
 */
export const testLogger = {
  step: (stepNumber: number | string, description: string) => {
    console.log(`\n🔹 [${stepNumber}] ${description}`);
  },

  success: (message: string, data?: any) => {
    console.log(`✅ [성공] ${message}`, data || '');
  },

  fail: (message: string, error?: any) => {
    console.error(`❌ [실패] ${message}`, error || '');
  },

  section: (title: string) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 ${title}`);
    console.log('='.repeat(60));
  }
};

/**
 * 맞춤형 검증 함수 (legacy supbaseTest.ts 호환)
 */
export const testMatchers = {
  expectNotNull: <T>(actual: T | null | undefined, message: string) => {
    expect(actual, message).toBeDefined();
    expect(actual, message).not.toBeNull();
    testLogger.success(`${message} (값 존재함)`);
  },

  expectEquals: <T>(actual: T, expected: T, message: string) => {
    expect(actual, message).toEqual(expected);
    testLogger.success(`${message} (값 일치: ${JSON.stringify(actual)})`);
  },

  expectBoolean: (actual: boolean, expected: boolean, message: string) => {
    expect(actual, message).toBe(expected);
    testLogger.success(`${message} (예상: ${expected}, 실제: ${actual})`);
  },

  expectLength: <T>(actual: T[], expectedLength: number, message: string) => {
    expect(actual.length, message).toBe(expectedLength);
    testLogger.success(`${message} (예상 길이: ${expectedLength}, 실제 길이: ${actual.length})`);
  }
};

/**
 * 테스트를 위한 인증 보장 헬퍼
 */
export const ensureAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await ensureUserProfile(session.user.id);
    return session.user;
  }

  // 세션이 없으면 테스트용 계정으로 로그인 시도
  const env = (import.meta as any).env || {};
  const email = env.VITE_TEST_USER_EMAIL || 'test_standard@example.com';
  const password = env.VITE_TEST_USER_PASSWORD || 'password123';

  let user;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    // 로그인 실패 시 회원가입 시도
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { nickname: 'Tester' } } 
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        // 이미 가입된 경우 비밀번호가 틀렸을 가능성이 큼 -> 랜덤 계정으로 폴백
        const fallbackEmail = `test_${Math.random().toString(36).substring(7)}@example.com`;
        const { data: fbData, error: fbError } = await supabase.auth.signUp({
          email: fallbackEmail,
          password,
          options: { data: { nickname: 'FallbackTester' } }
        });
        if (fbError) throw new Error(`Auth failed: ${fbError.message}`);
        user = fbData.user!;
      } else {
        throw new Error(`Auth failed: ${signUpError.message}`);
      }
    } else {
      user = signUpData.user!;
    }
  } else {
    user = data.user!;
  }

  // 프로필 존재 보장
  await ensureUserProfile(user.id);
  return user;
};
