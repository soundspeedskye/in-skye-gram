export interface CreatePostDto {
  content: string;
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
    id: string;
    content: string;
    imageUrls: string[];
    taggedUsers: string[];
    createdAt: string;
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
