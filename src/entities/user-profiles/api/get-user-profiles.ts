import { supabase } from "@/shared/api/supabase";
import { getCurrentUser } from "@/shared/api/auth-utils";
import type { UserProfilesDto } from "../model/user-profiles.dto";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type UserProfile = Camelize<Tables<"user_profiles">>;

export const getUserProfiles = async (
  userIds: string[],
): Promise<UserProfilesDto[]> => {
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .in("user_id", userIds);

  if (error) throw error;
  return data as UserProfilesDto[];
};

export const getCurrentUserProfile =
  async (): Promise<UserProfilesDto | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    return data as UserProfilesDto;
  };

export const getUserProfile = async (
  userId: string,
): Promise<UserProfilesDto | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfilesDto | null;
};

export const getUserProfilesModel = async (
  userIds: string[],
): Promise<UserProfile[]> => {
  const profiles = await getUserProfiles(userIds);
  return toCamelCase<UserProfile[]>(profiles);
};

export const getCurrentUserProfileModel =
  async (): Promise<UserProfile | null> => {
    const profile = await getCurrentUserProfile();
    return profile ? toCamelCase<UserProfile>(profile) : null;
  };

export const getUserProfileModel = async (
  userId: string,
): Promise<UserProfile | null> => {
  const profile = await getUserProfile(userId);
  return profile ? toCamelCase<UserProfile>(profile) : null;
};
