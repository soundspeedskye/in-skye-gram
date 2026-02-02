// 피드 북마크 추가

import type { FeedBookmarkDto } from "@/entities/feed/feed-bookmark/model/feed-bookmark.dto";
import { supabase } from "@/shared/api/supabase";

export const createFeedBookmark = async (
  feedId: number,
): Promise<FeedBookmarkDto> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("feed_bookmarks")
    .insert({
      feed_id: feedId,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    // PK (feed_id, user_id) 중복
    if (error.code === "23505") {
      throw new Error("Already bookmarked this feed");
    }
    throw error;
  }

  return data as FeedBookmarkDto;
};
