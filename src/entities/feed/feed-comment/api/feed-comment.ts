import { supabase } from "@/shared/api/supabase";
import type { FeedCommentWithProfile } from "../model/feed-comment.dto";

// 댓글 목록 조회
export const getFeedCommentsWithProfile = async (
  feedId: number,
): Promise<FeedCommentWithProfile[]> => {
  const { data, error } = await supabase
    .from("feed_comments")
    .select(
      `
        *,
        user_profiles (
          nickname,
          profile_image_url
        )
      `,
    )
    .eq("feed_id", feedId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // 댓글과 대댓글 분리
  const comments = (data || []) as FeedCommentWithProfile[];
  const topLevelComments = comments.filter(
    (comment) => comment.parent_comment_id === null,
  );
  const replies = comments.filter(
    (comment) => comment.parent_comment_id !== null,
  );

  // 대댓글을 부모 댓글의 replies에 추가
  topLevelComments.forEach((comment) => {
    comment.replies = replies.filter(
      (reply) => reply.parent_comment_id === comment.id,
    );
  });

  return topLevelComments;
};

// 특정 댓글 조회
export const getFeedCommentById = async (
  commentId: number,
): Promise<FeedCommentWithProfile | null> => {
  const { data, error } = await supabase
    .from("feed_comments")
    .select(
      `
        *,
        user_profiles (
          nickname,
          profile_image_url
        )
      `,
    )
    .eq("id", commentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as FeedCommentWithProfile;
};
