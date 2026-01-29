import { z } from "zod";

// 피드 북마크 스키마
export const feedBookmarkSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const createFeedBookmarkSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
});

export const deleteFeedBookmarkSchema = z.object({
  feed_id: z.number().positive(),
  user_id: z.string().uuid(),
});

export type FeedBookmark = z.infer<typeof feedBookmarkSchema>;
export type CreateFeedBookmark = z.infer<typeof createFeedBookmarkSchema>;
export type DeleteFeedBookmark = z.infer<typeof deleteFeedBookmarkSchema>;
