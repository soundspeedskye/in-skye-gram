import { supabase } from "@/shared/api/supabase";
import { requireCurrentUser } from "@/shared/api/auth-utils";
import type { FeedShareDto, FeedShareParams } from "../model/feed-share.dto";

// 내가 공유한 피드 목록 조회
export const getFeedShare = async (
  params: FeedShareParams = {},
): Promise<FeedShareDto[]> => {
  const user = await requireCurrentUser();

  const { limit = 10, offset = 0 } = params;

  const { data, error } = await supabase
    .from("feed_shares")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedShareDto[];
};
