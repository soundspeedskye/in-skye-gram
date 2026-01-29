import { supabase } from "@/shared/api/supabase";
import type {
  FeedDto,
  FeedListParams,
  FeedWithProfile,
} from "../model/feed.dto";

export const getFeeds = async (params?: FeedListParams): Promise<FeedDto[]> => {
  const { limit = 20, offset = 0 } = params || {};

  const { data, error } = await supabase
    .from("feeds")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedDto[];
};

export const getFeedsWithProfile = async (
  params?: FeedListParams,
): Promise<FeedWithProfile[]> => {
  const { limit = 20, offset = 0 } = params || {};

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
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedWithProfile[];
};
