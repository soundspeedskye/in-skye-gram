// 게시글
export interface PostDto {
  id: string;
  username: string;
  userAvatar?: string;
  postImage: string;
  content: string;
  likes: number;
  comments: CommentsDto[];
  createdAt: string;
  isVerified?: boolean;

  isLiked: boolean;
  isSaved: boolean;
}

// 댓글 dto
export interface CommentsDto {
  id: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}
