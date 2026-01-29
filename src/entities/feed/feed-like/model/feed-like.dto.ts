// 피드 좋아요
export interface FeedLikeDto {
  feed_id: number;
  user_id: string;
  created_at: string;
}

export interface CreateFeedLikeDto {
  feed_id: number;
  user_id: string;
}

export interface DeleteFeedLikeDto {
  feed_id: number;
  user_id: string;
}

export interface FeedLikeParams {
  feed_id?: number;
  user_id?: string;
}
