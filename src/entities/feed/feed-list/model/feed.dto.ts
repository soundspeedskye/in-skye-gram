// 게시글
export interface FeedDto {
  id: number;
  user_id: string;
  images: string[];
  caption: string;
  likes_count: number;
  comments_count: number;
  shared_count: number;
  created_at: string;
}

export interface FeedListParams {
  limit?: number;
  offset?: number;
}

export interface FeedWithProfile extends FeedDto {
  user_profiles: {
    nickname: string | null;
    profile_image_url: string | null;
  };
}
