// 피드 댓글
export interface FeedCommentDto {
  id: number;
  feed_id: number;
  user_id: string;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
}

export interface CreateFeedCommentDto {
  feed_id: number;
  user_id: string;
  content: string;
  parent_comment_id?: number | null;
}

export interface UpdateFeedCommentDto {
  id: number;
  content: string;
}

export interface DeleteFeedCommentDto {
  id: number;
  user_id: string;
}

export interface FeedCommentParams {
  feed_id?: number;
  user_id?: string;
  parent_comment_id?: number | null;
}

export interface FeedCommentWithProfile extends FeedCommentDto {
  user_profiles: {
    nickname: string | null;
    profile_image_url: string | null;
  };
}
