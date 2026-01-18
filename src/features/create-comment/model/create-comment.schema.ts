import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글을 입력해주세요.")
    .max(2200, "댓글은 2200자를 초과할 수 없습니다.")
    .trim(),
  postId: z.string().min(1, "게시글 ID가 필요합니다."),
  parentCommentId: z.string().optional(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
