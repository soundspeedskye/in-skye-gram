// 피드 북마크
export interface FeedBookmarkDto {
  feed_id: number;
  user_id: string;
  created_at: string;
}

export interface FeedBookmarkParams {
  limit?: number;
  offset?: number;
}
