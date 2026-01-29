import { z } from "zod";

// 피드 댓글 스키마
export const feedCommentSchema = z.object({
  id: z.number().positive(),
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
  content: z.string().min(1, "댓글 내용을 입력해주세요"),
  parent_comment_id: z.number().positive().nullable(),
  created_at: z.string().datetime(),
});

export const createFeedCommentSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
  content: z
    .string()
    .min(1, "댓글 내용을 입력해주세요")
    .max(1000, "댓글은 1000자 이하로 작성해주세요"),
  parent_comment_id: z.number().positive().nullable().optional(),
});

export const updateFeedCommentSchema = z.object({
  id: z.number().positive(),
  content: z
    .string()
    .min(1, "댓글 내용을 입력해주세요")
    .max(1000, "댓글은 1000자 이하로 작성해주세요"),
});

export const deleteFeedCommentSchema = z.object({
  id: z.number().positive(),
  user_id: z.string().uuid(),
});

export type FeedComment = z.infer<typeof feedCommentSchema>;
export type CreateFeedComment = z.infer<typeof createFeedCommentSchema>;
export type UpdateFeedComment = z.infer<typeof updateFeedCommentSchema>;
export type DeleteFeedComment = z.infer<typeof deleteFeedCommentSchema>;
