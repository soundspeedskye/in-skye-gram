import type { Tables } from "@/shared/api/supabase.types";

export type FeedCommentDto = Tables<"feed_comments">;
export type FeedCommentProfileDto = Pick<
  Tables<"user_profiles">,
  "nickname" | "profile_image_url"
>;

export interface FeedCommentWithProfile extends FeedCommentDto {
  user_profiles: FeedCommentProfileDto | FeedCommentProfileDto[] | null;
  replies?: FeedCommentWithProfile[];
}
