import { supabase } from '@/shared/api/supabase';
import { requireCurrentUser } from '@/shared/api/auth-utils';
import type { Tables, Camelize } from '@/shared/api/types';
import { toCamelCase } from '@/shared/lib/utils/case';

/** 피드 댓글 도메인 모델 (자동 변환) */
export type FeedComment = Camelize<Tables<'feed_comments'>>;

/** 조인을 위한 user_profiles 테이블의 부분 타입 */
export type CommentProfileRow = Pick<Tables<'user_profiles'>, 'nickname' | 'profile_image_url'>;
export type CommentProfile = Camelize<CommentProfileRow>;

/** 프로필 정보 및 답글(Tree) 형식이 포함된 댓글 모델 */
export interface FeedCommentWithProfile extends FeedComment {
  userProfiles: CommentProfile;
  replies?: FeedCommentWithProfile[];
}

/** DB 레벨의 조인 로우 타입 */
export interface FeedCommentWithProfileRow extends Tables<'feed_comments'> {
  user_profiles: CommentProfileRow | null;
}

// ===== Mapping Functions (snake_case -> camelCase) =====

/** 
 * UI 트리를 위한 보조 매퍼 (구조적 변환은 toCamelCase가 수행하며, 
 * 이 함수는 toCamelCase 결과물에 대한 프로필 필드 정규화만 담당)
 */
const transformComment = (row: any): FeedCommentWithProfile => {
  const camelized = toCamelCase<any>(row);
  return {
    ...camelized,
    userProfiles: camelized.userProfiles ?? { nickname: null, profileImageUrl: null },
  };
};

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

    return toCamelCase<FeedComment>(data);
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
    return toCamelCase<FeedComment>(data);
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
    const comments = rows.map(transformComment);

    const topLevelComments = comments.filter((comment) => comment.parentCommentId === null);
    const replies = comments.filter((comment) => comment.parentCommentId !== null);

    topLevelComments.forEach((comment) => {
      comment.replies = replies.filter((reply) => reply.parentCommentId === comment.id);
    });

    return topLevelComments;
  },
};
