import type { FeedLikeDto } from "@/entities/feed/feed-like/model/feed-like.dto";
import { supabase } from "@/shared/api/supabase";

export const createFeedLike = async (feed_id: number): Promise<FeedLikeDto> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("feed_likes")
    .insert({
      feed_id: feed_id,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Already liked this feed");
    }
    throw error;
  }
  return data as FeedLikeDto;
};
