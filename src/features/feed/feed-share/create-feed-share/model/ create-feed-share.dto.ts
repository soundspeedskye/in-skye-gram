import type { Tables } from "@/shared/api/supabase.types";

export interface CreateFeedShareDto {
  feedId: Tables<"feed_shares">["feed_id"];
}

export type CreateFeedShareResponseDto = Tables<"feed_shares">;
