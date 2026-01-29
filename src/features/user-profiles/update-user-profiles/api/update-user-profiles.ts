import type { UserProfilesDto } from "@/entities/user-profiles/model/user-profiles.dto";
import { supabase } from "@/shared/api/supabase";
import type { UpdateUserProfileDto } from "../model/update-user-profiles.dto";

export const updateUserProfile = async (
  params: UpdateUserProfileDto,
): Promise<UserProfilesDto> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not found");

  // 수정할 데이터만 필터링 (undefined 제외)
  const updateData: Partial<UpdateUserProfileDto> = {};
  if (params.nickname !== undefined) updateData.nickname = params.nickname;
  if (params.description !== undefined)
    updateData.description = params.description;
  if (params.profile_image_url !== undefined)
    updateData.profile_image_url = params.profile_image_url;

  // 수정할 데이터가 없으면 에러
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updateData)
    .eq("id", user.id)
    .select()
    .single();
  if (error) throw error;
  if (!data) throw new Error("Profile update failed");

  return data;
};
