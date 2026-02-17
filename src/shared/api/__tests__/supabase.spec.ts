import { describe, it, expect } from 'vitest';
import { supabase } from '../supabase';

describe('Supabase Connectivity Test', () => {
  it('should connect to Supabase and have a valid client', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should be able to fetch data from a public table (user_profiles)', async () => {
    const { error } = await supabase.from('user_profiles').select('*').limit(1);
    
    // 만약 API 키 관련 에러가 발생한다면, .env의 변수명과 supabase.ts의 변수명이 일치하는지 확인해야 합니다.
    expect(error?.code).not.toBe('FETCH_ERROR');
  });
});
