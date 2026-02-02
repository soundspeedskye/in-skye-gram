import { supabase } from "@/shared/api/supabase";
import type { FeedLikeDto, FeedLikeParams } from "../model/feed-like.dto";

// 특정 좋아요 확인
export const getFeedLike = async ({
  feed_id,
}: FeedLikeDto): Promise<boolean> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return false;

  const { data, error } = await supabase
    .from("feed_likes")
    .select("feed_id")
    .eq("feed_id", feed_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

// 여러 피드에 대한 좋아요 여부 확인
export const getFeedLikes = async (
  feed_ids: number[],
): Promise<Record<number, boolean>> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return {};

  if (feed_ids.length === 0) return {};

  const { data, error } = await supabase
    .from("feed_likes")
    .select("feed_id")
    .eq("user_id", user.id)
    .in("feed_id", feed_ids);

  if (error) throw error;

  const result: Record<number, boolean> = {};
  feed_ids.forEach((id) => {
    result[id] = false;
  });

  data?.forEach((like) => {
    result[like.feed_id] = true;
  });

  return result;
};

// 내가 좋아요한 피드 목록 조회
export const getMyLikedFeeds = async (
  params: FeedLikeParams,
): Promise<FeedLikeDto[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { limit = 10, offset = 0 } = params;

  const { data, error } = await supabase
    .from("feed_likes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
};
