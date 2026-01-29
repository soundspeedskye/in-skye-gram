import { supabase } from "@/shared/api/supabase";
import type { FeedDto, FeedWithProfile } from "../model/feed.dto";

export const getFeedById = async (feedId: number): Promise<FeedDto | null> => {
  const { data, error } = await supabase
    .from("feeds")
    .select("*")
    .eq("id", feedId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedDto;
};

export const getFeedByIdWithProfile = async (
  feedId: number,
): Promise<FeedWithProfile | null> => {
  const { data, error } = await supabase
    .from("feeds")
    .select(
      `
      *,
      user_profiles:user_profiles!feeds_user_id_profile_fkey(
        nickname,
        profile_image_url
      )
    `,
    )
    .eq("id", feedId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedWithProfile;
};

export const getFeedsByUserId = async (
  userId: string,
  limit = 20,
  offset = 0,
): Promise<FeedDto[]> => {
  const { data, error } = await supabase
    .from("feeds")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedDto[];
};
