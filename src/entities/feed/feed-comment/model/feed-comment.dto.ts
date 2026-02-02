// 피드 댓글
export interface FeedCommentDto {
  id: number;
  feed_id: number;
  user_id: string;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
}

export interface FeedCommentWithProfile extends FeedCommentDto {
  user_profiles: {
    nickname: string | null;
    profile_image_url: string | null;
  };
  replies?: FeedCommentWithProfile[]; // 대댓글 목록
}
