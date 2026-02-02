// 피드 좋아요
export interface FeedLikeDto {
  feed_id: number;
  user_id: string;
  created_at: string;
}

export interface FeedLikeParams {
  limit?: number;
  offset?: number;
}
