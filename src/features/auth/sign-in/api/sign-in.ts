// sign-in API

import { supabase } from "@/shared/api/supabase";
import type { SignInSchema } from "../model/sign-in.schema";

export const signIn = async ({ email, password }: SignInSchema) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("User not found");

  return data;
};
