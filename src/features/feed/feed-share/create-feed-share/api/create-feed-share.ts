import type { FeedShareDto } from "@/entities/feed/feed-share/model/feed-share.dto";
import { supabase } from "@/shared/api/supabase";

export const createFeedShare = async (
  feed_id: number,
): Promise<FeedShareDto> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  // insert만 수행 → 중복 허용
  const { data, error } = await supabase
    .from("feed_shares")
    .insert([{ feed_id, user_id: user.id }])
    .select()
    .single(); // 한 행만 반환

  if (error) throw error;
  return data as FeedShareDto;
};
