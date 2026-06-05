import type { CreateFeedCommentDto } from "../model/create-feed-comment.dto";
import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type FeedComment = Camelize<Tables<"feed_comments">>;

export const createFeedComment = async (
  params: CreateFeedCommentDto,
): Promise<FeedComment> => {
  const user = await requireCurrentUser();

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

  return toCamelCase<FeedComment>(data);
};
