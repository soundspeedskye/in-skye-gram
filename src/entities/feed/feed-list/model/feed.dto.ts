import type { Tables } from "@/shared/api/supabase.types";

export type FeedDto = Tables<"feeds">;

export interface FeedListParams {
  limit?: number;
  offset?: number;
}

export type FeedProfileDto = Pick<
  Tables<"user_profiles">,
  "nickname" | "profile_image_url"
>;

export interface FeedWithProfile extends FeedDto {
  user_profiles: FeedProfileDto | FeedProfileDto[] | null;
}

export interface FeedPostCardDto {
  id: FeedDto["id"];
  author: {
    id: FeedDto["user_id"];
    nickname: NonNullable<FeedProfileDto["nickname"]>;
    profileImageUrl: FeedProfileDto["profile_image_url"];
    isVerified: boolean;
  };
  caption: FeedDto["caption"];
  images: FeedDto["images"];
  counts: {
    likes: FeedDto["likes_count"];
    comments: FeedDto["comments_count"];
    shares: FeedDto["shared_count"];
  };
  viewer: {
    isLiked: boolean;
    isBookmarked: boolean;
  };
  createdAt: FeedDto["created_at"];
}

export interface FeedPostCardListResponseDto {
  items: FeedPostCardDto[];
  pageInfo: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

export interface PostCommentDto {
  id: Tables<"feed_comments">["id"] | string;
  username: string;
  userAvatar: string;
  content: Tables<"feed_comments">["content"];
  createdAt: Tables<"feed_comments">["created_at"];
}

export interface PostDto extends FeedDto {
  username: string;
  userAvatar: string;
  postImage: string;
  content: FeedDto["caption"];
  likes: FeedDto["likes_count"];
  comments?: PostCommentDto[];
  createdAt: FeedDto["created_at"];
  isVerified?: boolean;
}
