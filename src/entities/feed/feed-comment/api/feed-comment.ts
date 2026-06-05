import { supabase } from "@/shared/api/supabase";
import type {
  FeedCommentProfileDto,
  FeedCommentWithProfile,
} from "../model/feed-comment.dto";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type FeedComment = Camelize<Tables<"feed_comments">>;
export type CommentProfile = Camelize<FeedCommentProfileDto>;

export interface FeedCommentModelWithProfile extends FeedComment {
  userProfiles: CommentProfile;
  replies?: FeedCommentModelWithProfile[];
}

const getFirstRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

const toCommentModelWithProfile = (
  comment: FeedCommentWithProfile,
): FeedCommentModelWithProfile => {
  const camelized = toCamelCase<FeedCommentModelWithProfile>(comment);
  const profile = getFirstRelation(comment.user_profiles);

  return {
    ...camelized,
    userProfiles: toCamelCase<CommentProfile>(
      profile ?? { nickname: null, profile_image_url: null },
    ),
  };
};

const toCommentModelTree = (
  comment: FeedCommentWithProfile,
): FeedCommentModelWithProfile => {
  const model = toCommentModelWithProfile(comment);

  if (comment.replies) {
    model.replies = comment.replies.map(toCommentModelTree);
  }

  return model;
};

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

export const getComments = async (
  feedId: number,
): Promise<FeedCommentModelWithProfile[]> => {
  const comments = await getFeedCommentsWithProfile(feedId);
  return comments.map(toCommentModelTree);
};

export const getComment = async (
  commentId: number,
): Promise<FeedCommentModelWithProfile | null> => {
  const comment = await getFeedCommentById(commentId);
  return comment ? toCommentModelWithProfile(comment) : null;
};
