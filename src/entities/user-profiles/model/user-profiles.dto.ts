export interface UserProfilesDto {
  user_id: string;
  nickname: string | null;
  description: string | null;
  profile_image_url: string | null;
  follower_count: number;
  following_count: number;
  post_count: number;
  created_at: string;
}
