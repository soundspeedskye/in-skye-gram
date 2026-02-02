import type { FeedCommentDto } from "@/entities/feed/feed-comment/model/feed-comment.dto";
import { supabase } from "@/shared/api/supabase";
import type { UpdateFeedCommentDto } from "../model/update-feed-comment.dto";

export const updateFeedComment = async (
  params: UpdateFeedCommentDto,
): Promise<FeedCommentDto> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

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
  return data as FeedCommentDto;
};
