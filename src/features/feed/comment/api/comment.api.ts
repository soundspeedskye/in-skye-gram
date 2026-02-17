import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser } from '@/shared/api/auth-utils';

export interface FeedComment {
  id: number;
  feedId: number;
  userId: string;
  parentCommentId: number | null;
  content: string;
  createdAt: string;
}

export interface FeedCommentRow {
  id: number;
  feed_id: number;
  user_id: string;
  parent_comment_id: number | null;
  content: string;
  created_at: string;
}

export interface FeedCommentWithProfileRow extends FeedCommentRow {
  user_profiles: {
    nickname: string | null;
    profile_image_url: string | null;
  };
}

export interface FeedCommentWithProfile extends FeedComment {
  userProfiles: {
    nickname: string | null;
    profileImageUrl: string | null;
  };
  replies?: FeedCommentWithProfile[];
}

const mapFeedComment = (row: FeedCommentRow): FeedComment => ({
  id: row.id,
  feedId: row.feed_id,
  userId: row.user_id,
  parentCommentId: row.parent_comment_id,
  content: row.content,
  createdAt: row.created_at,
});

const mapFeedCommentWithProfile = (row: FeedCommentWithProfileRow): FeedCommentWithProfile => ({
  ...mapFeedComment(row),
  userProfiles: {
    nickname: row.user_profiles?.nickname ?? null,
    profileImageUrl: row.user_profiles?.profile_image_url ?? null,
  },
});

export const feedCommentAPI = {
  /**
   * 댓글 작성
   */
  createComment: async (params: { feedId: number; content: string; parentCommentId?: number | null }): Promise<FeedComment> => {
    const user = await requireCurrentUser();

    const { data, error } = await supabase
      .from('feed_comments')
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

    return mapFeedComment(data as FeedCommentRow);
  },

  /**
   * 댓글 수정
   */
  updateComment: async (commentId: number, content: string): Promise<FeedComment> => {
    const user = await requireCurrentUser();

    const { data: existingComment, error: fetchError } = await supabase
      .from('feed_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (fetchError) throw fetchError;
    if ((existingComment as { user_id: string }).user_id !== user.id) {
      throw new Error('Not authorized to update this comment');
    }

    const { data, error } = await supabase.from('feed_comments').update({ content }).eq('id', commentId).select().single();

    if (error) throw error;
    return mapFeedComment(data as FeedCommentRow);
  },

  /**
   * 댓글 삭제
   */
  deleteComment: async (commentId: number): Promise<void> => {
    const user = await requireCurrentUser();

    const { data: existingComment, error: fetchError } = await supabase
      .from('feed_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (fetchError) throw fetchError;
    if ((existingComment as { user_id: string }).user_id !== user.id) {
      throw new Error('Not authorized to delete this comment');
    }

    const { error } = await supabase.from('feed_comments').delete().eq('id', commentId);

    if (error) throw error;
  },

  /**
   * 피드 댓글 목록 조회 (대댓글 포함)
   */
  getComments: async (feedId: number): Promise<FeedCommentWithProfile[]> => {
    const { data, error } = await supabase
      .from('feed_comments')
      .select(
        `
        *,
        user_profiles (
          nickname,
          profile_image_url
        )
      `
      )
      .eq('feed_id', feedId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const rows = (data || []) as FeedCommentWithProfileRow[];
    const comments = rows.map(mapFeedCommentWithProfile);

    const topLevelComments = comments.filter((comment) => comment.parentCommentId === null);
    const replies = comments.filter((comment) => comment.parentCommentId !== null);

    topLevelComments.forEach((comment) => {
      comment.replies = replies.filter((reply) => reply.parentCommentId === comment.id);
    });

    return topLevelComments;
  },
};
