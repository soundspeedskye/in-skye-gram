import { z } from "zod";

// 피드 좋아요 스키마
export const feedLikeSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const createFeedLikeSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
});

export const deleteFeedLikeSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
});

export type FeedLike = z.infer<typeof feedLikeSchema>;
export type CreateFeedLike = z.infer<typeof createFeedLikeSchema>;
export type DeleteFeedLike = z.infer<typeof deleteFeedLikeSchema>;
