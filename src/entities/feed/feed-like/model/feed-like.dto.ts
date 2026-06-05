import type { Tables } from "@/shared/api/supabase.types";

export type FeedLikeDto = Tables<"feed_likes">;

export interface FeedLikeParams {
  limit?: number;
  offset?: number;
}
