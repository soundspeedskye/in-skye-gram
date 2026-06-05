import type { Tables } from "@/shared/api/supabase.types";

export interface CreateFeedCommentDto {
  feedId: Tables<"feed_comments">["feed_id"];
  content: Tables<"feed_comments">["content"];
  parentCommentId?: Tables<"feed_comments">["parent_comment_id"];
}
