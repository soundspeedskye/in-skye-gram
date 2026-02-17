import { supabase } from "@/shared/api/supabase";
import { ensureUserProfile } from "@/shared/api/user-profile.utils";
import type { SignUpSchema } from "../model/sign-up.schema";

export const signUp = async ({ email, password }: SignUpSchema) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("User not found");

  // 프로필 자동 생성 및 닉네임 할당
  await ensureUserProfile(data.user.id);

  return data;
};
