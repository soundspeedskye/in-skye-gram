import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";
import type { UpdateFeedCommentDto } from "../model/update-feed-comment.dto";

export type FeedComment = Camelize<Tables<"feed_comments">>;

export const updateFeedComment = async (
  params: UpdateFeedCommentDto,
): Promise<FeedComment> => {
  const user = await requireCurrentUser();

  // 본인 댓글인지 확인
  const { data: existingComment, error: fetchError } = await supabase
    .from("feed_comments")
    .select("user_id")
    .eq("id", params.commentId)
    .single();

  if (fetchError) throw fetchError;
  if (existingComment.user_id !== user.id) {
    throw new Error("Not authorized to update this comment");
  }

  const { data, error } = await supabase
    .from("feed_comments")
    .update({ content: params.content })
    .eq("id", params.commentId)
    .select()
    .single();

  if (error) throw error;
  return toCamelCase<FeedComment>(data);
};
