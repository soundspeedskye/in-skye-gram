// 피드 공유
export interface FeedShareDto {
  id: number;
  feed_id: number;
  user_id: string;
  created_at: string;
}

export interface CreateFeedShareDto {
  feed_id: number;
  user_id: string;
}

export interface DeleteFeedShareDto {
  id: number;
  user_id: string;
}

export interface FeedShareParams {
  feed_id?: number;
  user_id?: string;
}
