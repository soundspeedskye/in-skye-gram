import { supabase } from "@/shared/api/supabase";
import type {
  FeedCommentDto,
  CreateFeedCommentDto,
  UpdateFeedCommentDto,
  DeleteFeedCommentDto,
  FeedCommentParams,
  FeedCommentWithProfile,
} from "../model/feed-comment.dto";

// 댓글 목록 조회
export const getFeedComments = async (
  params?: FeedCommentParams,
): Promise<FeedCommentDto[]> => {
  let query = supabase
    .from("feed_comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (params?.feed_id) {
    query = query.eq("feed_id", params.feed_id);
  }

  if (params?.user_id) {
    query = query.eq("user_id", params.user_id);
  }

  if (params?.parent_comment_id !== undefined) {
    if (params.parent_comment_id === null) {
      query = query.is("parent_comment_id", null);
    } else {
      query = query.eq("parent_comment_id", params.parent_comment_id);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FeedCommentDto[];
};

// 프로필과 함께 댓글 목록 조회
export const getFeedCommentsWithProfile = async (
  params?: FeedCommentParams,
): Promise<FeedCommentWithProfile[]> => {
  let query = supabase
    .from("feed_comments")
    .select(
      `
      *,
      user_profiles:user_profiles!feed_comments_user_id_profile_fkey(
        nickname,
        profile_image_url
      )
    `,
    )
    .order("created_at", { ascending: true });

  if (params?.feed_id) {
    query = query.eq("feed_id", params.feed_id);
  }

  if (params?.user_id) {
    query = query.eq("user_id", params.user_id);
  }

  if (params?.parent_comment_id !== undefined) {
    if (params.parent_comment_id === null) {
      query = query.is("parent_comment_id", null);
    } else {
      query = query.eq("parent_comment_id", params.parent_comment_id);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FeedCommentWithProfile[];
};

// 특정 댓글 조회
export const getFeedCommentById = async (
  commentId: number,
): Promise<FeedCommentDto | null> => {
  const { data, error } = await supabase
    .from("feed_comments")
    .select("*")
    .eq("id", commentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedCommentDto;
};

// 댓글 생성
export const createFeedComment = async (
  comment: CreateFeedCommentDto,
): Promise<FeedCommentDto> => {
  const { data, error } = await supabase
    .from("feed_comments")
    .insert(comment)
    .select()
    .single();

  if (error) throw error;
  return data as FeedCommentDto;
};

// 댓글 수정
export const updateFeedComment = async (
  comment: UpdateFeedCommentDto,
): Promise<FeedCommentDto> => {
  const { data, error } = await supabase
    .from("feed_comments")
    .update({ content: comment.content })
    .eq("id", comment.id)
    .select()
    .single();

  if (error) throw error;
  return data as FeedCommentDto;
};

// 댓글 삭제
export const deleteFeedComment = async (
  comment: DeleteFeedCommentDto,
): Promise<void> => {
  const { error } = await supabase
    .from("feed_comments")
    .delete()
    .eq("id", comment.id)
    .eq("user_id", comment.user_id);

  if (error) throw error;
};

// 피드의 댓글 수 조회
export const getFeedCommentCount = async (feed_id: number): Promise<number> => {
  const { count, error } = await supabase
    .from("feed_comments")
    .select("*", { count: "exact", head: true })
    .eq("feed_id", feed_id);

  if (error) throw error;
  return count || 0;
};

// 특정 댓글의 대댓글 조회
export const getRepliesForComment = async (
  parentCommentId: number,
): Promise<FeedCommentWithProfile[]> => {
  return getFeedCommentsWithProfile({
    parent_comment_id: parentCommentId,
  });
};
