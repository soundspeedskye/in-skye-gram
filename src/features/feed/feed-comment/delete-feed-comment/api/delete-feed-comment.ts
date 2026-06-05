import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { DeleteFeedCommentDto } from "../model/delete-feed-comment.dto";

export const deleteFeedComment = async ({
  commentId,
}: DeleteFeedCommentDto): Promise<void> => {
  const user = await requireCurrentUser();

  // 본인 댓글인지 확인 및 feed_id 가져오기
  const { data: existingComment, error: fetchError } = await supabase
    .from("feed_comments")
    .select("user_id, feed_id")
    .eq("id", commentId)
    .single();

  if (fetchError) throw fetchError;
  if (existingComment.user_id !== user.id) {
    throw new Error("Not authorized to delete this comment");
  }

  const { error } = await supabase
    .from("feed_comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
};
