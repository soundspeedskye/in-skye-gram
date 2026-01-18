export interface CreateCommentDto {
  postId: string;
  content: string;
  parentCommentId?: string; // 대댓글용 (optional)
}

export interface CreateCommentResponse {
  id: string;
  postId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  parentCommentId?: string;
}
