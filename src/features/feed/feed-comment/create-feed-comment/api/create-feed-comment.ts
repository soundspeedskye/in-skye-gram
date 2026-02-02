import type { FeedCommentDto } from "@/entities/feed/feed-comment/model/feed-comment.dto";
import type { CreateFeedCommentDto } from "../model/create-feed-comment.dto";
import { supabase } from "@/shared/api/supabase";

export const createFeedComment = async (
  params: CreateFeedCommentDto,
): Promise<FeedCommentDto> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("feed_comments")
    .insert([
      {
        feed_id: params.feedId,
        user_id: user.id,
        parent_comment_id: params.parentCommentId || null,
        content: params.content,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data as FeedCommentDto;
};
