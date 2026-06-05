import type { Tables } from "@/shared/api/supabase.types";

export interface CreateFeedLikeDto {
  feedId: Tables<"feed_likes">["feed_id"];
}

export type CreateFeedLikeResponseDto = Tables<"feed_likes">;
