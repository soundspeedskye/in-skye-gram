import type { Tables } from "@/shared/api/supabase.types";

export type FeedShareDto = Tables<"feed_shares">;

export interface FeedShareParams {
  limit?: number;
  offset?: number;
}
