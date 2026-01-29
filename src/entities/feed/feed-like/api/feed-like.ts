import { supabase } from "@/shared/api/supabase";
import type {
  FeedLikeDto,
  CreateFeedLikeDto,
  DeleteFeedLikeDto,
  FeedLikeParams,
} from "../model/feed-like.dto";

// 좋아요 목록 조회
export const getFeedLikes = async (
  params?: FeedLikeParams,
): Promise<FeedLikeDto[]> => {
  let query = supabase
    .from("feed_likes")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.feed_id) {
    query = query.eq("feed_id", params.feed_id);
  }

  if (params?.user_id) {
    query = query.eq("user_id", params.user_id);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FeedLikeDto[];
};

// 특정 좋아요 확인
export const getFeedLike = async (
  feed_id: number,
  user_id: string,
): Promise<FeedLikeDto | null> => {
  const { data, error } = await supabase
    .from("feed_likes")
    .select("*")
    .eq("feed_id", feed_id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedLikeDto;
};

// 좋아요 생성
export const createFeedLike = async (
  like: CreateFeedLikeDto,
): Promise<FeedLikeDto> => {
  const { data, error } = await supabase
    .from("feed_likes")
    .insert(like)
    .select()
    .single();

  if (error) throw error;
  return data as FeedLikeDto;
};

// 좋아요 삭제
export const deleteFeedLike = async (
  like: DeleteFeedLikeDto,
): Promise<void> => {
  const { error } = await supabase
    .from("feed_likes")
    .delete()
    .eq("feed_id", like.feed_id)
    .eq("user_id", like.user_id);

  if (error) throw error;
};

// 좋아요 토글
export const toggleFeedLike = async (
  feed_id: number,
  user_id: string,
): Promise<{ isLiked: boolean }> => {
  const existingLike = await getFeedLike(feed_id, user_id);

  if (existingLike) {
    await deleteFeedLike({ feed_id, user_id });
    return { isLiked: false };
  } else {
    await createFeedLike({ feed_id, user_id });
    return { isLiked: true };
  }
};

// 피드의 좋아요 수 조회
export const getFeedLikeCount = async (feed_id: number): Promise<number> => {
  const { count, error } = await supabase
    .from("feed_likes")
    .select("*", { count: "exact", head: true })
    .eq("feed_id", feed_id);

  if (error) throw error;
  return count || 0;
};
