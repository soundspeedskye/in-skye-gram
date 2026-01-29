// sign-up API

import { supabase } from "@/shared/api/supabase";
import type { SignUpSchema } from "../model/sign-up.schema";

export const signUp = async ({ email, password }: SignUpSchema) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("User not found");

  const profileImageUrl = generateRandomProfileImage();

  const { error: profileError } = await supabase.from("user_profiles").insert([
    {
      user_id: data.user.id,
      profile_image_url: profileImageUrl,
    },
  ]);

  if (profileError) throw profileError;

  return data;
};

// 프로필 이미지 랜덤 생성
const generateRandomProfileImage = () =>
  `https://picsum.photos/50/50?random=${Date.now()}`;
