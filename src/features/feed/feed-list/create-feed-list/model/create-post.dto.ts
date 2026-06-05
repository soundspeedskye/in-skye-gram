import type { Tables, TablesInsert } from "@/shared/api/supabase.types";

type FeedDto = Tables<"feeds">;
type FeedInsertDto = TablesInsert<"feeds">;

export interface CreatePostDto {
  content: FeedInsertDto["caption"];
  imageFiles: File[];
  taggedUsers?: string[];
  isCommentsDisabled?: boolean;
  isLikesHidden?: boolean;
  altText?: string[];
}

export interface CreatePostResponseDto {
  success: boolean;
  message: string;
  post?: {
    id: FeedDto["id"];
    content: FeedDto["caption"];
    imageUrls: string[];
    taggedUsers: string[];
    createdAt: FeedDto["created_at"];
    isCommentsDisabled: boolean;
    isLikesHidden: boolean;
    altText?: string[];
  };
}

export interface ImageUploadDto {
  file: File;
  altText?: string;
  aspectRatio?: "1:1" | "4:5" | "16:9";
  filter?: string;
}

export interface PostMediaDto {
  id: string;
  url: string;
  type: "image" | "video";
  altText?: string;
  width: number;
  height: number;
}
