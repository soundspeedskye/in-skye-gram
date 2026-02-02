// 피드 공유
export interface FeedShareDto {
  id: number;
  feed_id: number;
  user_id: string;
  created_at: string;
}

export interface FeedShareParams {
  limit?: number;
  offset?: number;
}
