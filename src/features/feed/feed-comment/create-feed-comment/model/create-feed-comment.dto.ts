export interface CreateFeedCommentDto {
  feedId: number;
  content: string;
  parentCommentId?: number | null; // 대댓글인 경우 부모 댓글 ID
}
