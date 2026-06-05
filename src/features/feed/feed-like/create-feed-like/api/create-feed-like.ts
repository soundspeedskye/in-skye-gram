import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type FeedLike = Camelize<Tables<"feed_likes">>;

export const createFeedLike = async (feed_id: number): Promise<FeedLike> => {
  const user = await requireCurrentUser();

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
  return toCamelCase<FeedLike>(data);
};
