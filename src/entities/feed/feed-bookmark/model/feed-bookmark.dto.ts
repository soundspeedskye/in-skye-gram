// 피드 북마크
export interface FeedBookmarkDto {
  feed_id: number;
  user_id: string;
  created_at: string;
}

export interface CreateFeedBookmarkDto {
  feed_id: number;
  user_id: string;
}

export interface DeleteFeedBookmarkDto {
  feed_id: number;
  user_id: string;
}

export interface FeedBookmarkParams {
  feed_id?: number;
  user_id?: string;
}
