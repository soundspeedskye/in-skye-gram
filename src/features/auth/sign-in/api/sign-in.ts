import { supabase } from "@/shared/api/supabase";
import { ensureUserProfile } from "@/shared/api/user-profile.utils";
import type { SignInSchema } from "../model/sign-in.schema";

export const signIn = async ({ email, password }: SignInSchema) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("User not found");

  // 프로필이 없으면 자동 생성
  await ensureUserProfile(data.user.id);

  return data;
};
