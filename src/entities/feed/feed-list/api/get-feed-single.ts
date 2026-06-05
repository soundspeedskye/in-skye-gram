import { supabase } from "@/shared/api/supabase";
import type { FeedDto, FeedProfileDto, FeedWithProfile } from "../model/feed.dto";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type Feed = Camelize<Tables<"feeds">>;
export type FeedProfile = Camelize<FeedProfileDto>;

export interface FeedModelWithProfile extends Feed {
  userProfiles: FeedProfile;
}

const getFirstRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

const toFeedModelWithProfile = (feed: FeedWithProfile): FeedModelWithProfile => {
  const camelized = toCamelCase<FeedModelWithProfile>(feed);
  const profile = getFirstRelation(feed.user_profiles);

  return {
    ...camelized,
    userProfiles: toCamelCase<FeedProfile>(
      profile ?? { nickname: null, profile_image_url: null },
    ),
  };
};

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

export const getFeed = async (
  feedId: number,
): Promise<FeedModelWithProfile | null> => {
  const feed = await getFeedByIdWithProfile(feedId);
  return feed ? toFeedModelWithProfile(feed) : null;
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
