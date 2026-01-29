import { supabase } from "@/shared/api/supabase";
import type {
  FeedShareDto,
  CreateFeedShareDto,
  DeleteFeedShareDto,
  FeedShareParams,
} from "../model/feed-share.dto";

// 공유 목록 조회
export const getFeedShares = async (
  params?: FeedShareParams,
): Promise<FeedShareDto[]> => {
  let query = supabase
    .from("feed_shares")
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
  return data as FeedShareDto[];
};

// 특정 공유 확인
export const getFeedShare = async (
  feed_id: number,
  user_id: string,
): Promise<FeedShareDto | null> => {
  const { data, error } = await supabase
    .from("feed_shares")
    .select("*")
    .eq("feed_id", feed_id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedShareDto;
};

// 공유 ID로 조회
export const getFeedShareById = async (
  shareId: number,
): Promise<FeedShareDto | null> => {
  const { data, error } = await supabase
    .from("feed_shares")
    .select("*")
    .eq("id", shareId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedShareDto;
};

// 공유 생성
export const createFeedShare = async (
  share: CreateFeedShareDto,
): Promise<FeedShareDto> => {
  const { data, error } = await supabase
    .from("feed_shares")
    .insert(share)
    .select()
    .single();

  if (error) throw error;
  return data as FeedShareDto;
};

// 공유 삭제 (ID와 사용자 ID로)
export const deleteFeedShare = async (
  share: DeleteFeedShareDto,
): Promise<void> => {
  const { error } = await supabase
    .from("feed_shares")
    .delete()
    .eq("id", share.id)
    .eq("user_id", share.user_id);

  if (error) throw error;
};

// 공유 삭제 (피드 ID와 사용자 ID로)
export const deleteFeedShareByFeedAndUser = async (
  feed_id: number,
  user_id: string,
): Promise<void> => {
  const { error } = await supabase
    .from("feed_shares")
    .delete()
    .eq("feed_id", feed_id)
    .eq("user_id", user_id);

  if (error) throw error;
};

// 피드의 공유 수 조회
export const getFeedShareCount = async (feed_id: number): Promise<number> => {
  const { count, error } = await supabase
    .from("feed_shares")
    .select("*", { count: "exact", head: true })
    .eq("feed_id", feed_id);

  if (error) throw error;
  return count || 0;
};
