import { supabase } from "@/shared/api/supabase";
import type { UserProfilesDto } from "../model/user-profiles.dto";

export const getCurrentUserProfile =
  async (): Promise<UserProfilesDto | null> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data as UserProfilesDto;
  };
