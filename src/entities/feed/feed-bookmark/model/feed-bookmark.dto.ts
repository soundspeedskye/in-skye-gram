import type { Tables } from "@/shared/api/supabase.types";

export type FeedBookmarkDto = Tables<"feed_bookmarks">;

export interface FeedBookmarkParams {
  limit?: number;
  offset?: number;
}
