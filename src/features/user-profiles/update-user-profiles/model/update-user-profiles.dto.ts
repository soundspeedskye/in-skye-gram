import type { TablesUpdate } from "@/shared/api/supabase.types";

type UserProfileUpdateDto = TablesUpdate<"user_profiles">;

export type UpdateUserProfileDto = Pick<
  UserProfileUpdateDto,
  "nickname" | "description" | "profile_image_url"
>;
