import type { UserProfilesDto } from "@/entities/user-profiles/model/user-profiles.dto";
import { profileImageStorage } from "@/shared/api/imageStorage";
import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import type { TablesUpdate } from "@/shared/api/supabase.types";
import { toCamelCase } from "@/shared/lib/utils/case";
import type { UpdateUserProfileDto } from "../model/update-user-profiles.dto";

export type UserProfile = Camelize<Tables<"user_profiles">>;

export const updateUserProfile = async (
  params: UpdateUserProfileDto,
): Promise<UserProfilesDto> => {
  const user = await requireCurrentUser();

  // 수정할 데이터만 필터링 (undefined 제외)
  const updateData: TablesUpdate<"user_profiles"> = {};
  if (params.nickname !== undefined) updateData.nickname = params.nickname;
  if (params.description !== undefined)
    updateData.description = params.description;
  if (params.profileImageFile) {
    updateData.profile_image_url = await profileImageStorage.upload(
      user.id,
      params.profileImageFile,
    );
  } else if (params.profileImageUrl !== undefined) {
    updateData.profile_image_url = params.profileImageUrl;
  } else if (params.profile_image_url !== undefined) {
    updateData.profile_image_url = params.profile_image_url;
  }

  // 수정할 데이터가 없으면 에러
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updateData)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw error;
  if (!data) throw new Error("Profile update failed");

  return data;
};

export const updateUserProfileModel = async (
  params: UpdateUserProfileDto,
): Promise<UserProfile> => {
  const profile = await updateUserProfile(params);
  return toCamelCase<UserProfile>(profile);
};
