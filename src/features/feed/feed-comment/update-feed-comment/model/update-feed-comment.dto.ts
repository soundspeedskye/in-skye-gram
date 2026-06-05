import type { Tables } from "@/shared/api/supabase.types";

export interface UpdateFeedCommentDto {
  commentId: Tables<"feed_comments">["id"];
  content: Tables<"feed_comments">["content"];
}
