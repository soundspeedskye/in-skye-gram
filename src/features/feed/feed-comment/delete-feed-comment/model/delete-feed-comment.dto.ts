import type { Tables } from "@/shared/api/supabase.types";

export interface DeleteFeedCommentDto {
  commentId: Tables<"feed_comments">["id"];
}
