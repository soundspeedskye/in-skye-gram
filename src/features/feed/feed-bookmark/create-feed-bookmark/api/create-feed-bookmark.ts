// 피드 북마크 추가

import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type FeedBookmark = Camelize<Tables<"feed_bookmarks">>;

export const createFeedBookmark = async (
  feedId: number,
): Promise<FeedBookmark> => {
  const user = await requireCurrentUser();

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

  return toCamelCase<FeedBookmark>(data);
};
