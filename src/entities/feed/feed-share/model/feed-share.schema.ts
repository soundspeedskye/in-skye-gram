import { z } from "zod";

// 피드 공유 스키마
export const feedShareSchema = z.object({
  id: z.number().positive(),
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const createFeedShareSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
});

export const deleteFeedShareSchema = z.object({
  id: z.number().positive(),
  user_id: z.string().uuid(),
});

export type FeedShare = z.infer<typeof feedShareSchema>;
export type CreateFeedShare = z.infer<typeof createFeedShareSchema>;
export type DeleteFeedShare = z.infer<typeof deleteFeedShareSchema>;
