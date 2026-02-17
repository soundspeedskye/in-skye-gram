import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

/**
 * 현재 로그인한 사용자 가져오기 (선택적)
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * 현재 로그인한 사용자 가져오기 (필수)
 */
export const requireCurrentUser = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
};
