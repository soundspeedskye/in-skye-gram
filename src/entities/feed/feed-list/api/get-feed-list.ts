import { supabase } from "@/shared/api/supabase";
import type {
  FeedPostCardDto,
  FeedDto,
  FeedListParams,
  FeedProfileDto,
  FeedWithProfile,
} from "../model/feed.dto";
import { getAreBookmarked } from "../../feed-bookmark/api/feed-bookmark";
import { getFeedLikes } from "../../feed-like/api/feed-like";

const getFirstRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

const toFeedPostCard = (
  feed: FeedWithProfile,
  likedFeedMap: Record<number, boolean> = {},
  bookmarkedFeedMap: Record<number, boolean> = {},
): FeedPostCardDto => {
  const profile = getFirstRelation<FeedProfileDto>(feed.user_profiles);
  const nickname = profile?.nickname?.trim() || feed.user_id;

  return {
    id: feed.id,
    author: {
      id: feed.user_id,
      nickname,
      profileImageUrl: profile?.profile_image_url ?? null,
      isVerified: false,
    },
    caption: feed.caption,
    images: feed.images,
    counts: {
      likes: feed.likes_count,
      comments: feed.comments_count,
      shares: feed.shared_count,
    },
    viewer: {
      isLiked: Boolean(likedFeedMap[feed.id]),
      isBookmarked: Boolean(bookmarkedFeedMap[feed.id]),
    },
    createdAt: feed.created_at,
  };
};

export const getFeeds = async (params?: FeedListParams): Promise<FeedDto[]> => {
  const { limit = 20, offset = 0 } = params || {};

  const { data, error } = await supabase
    .from("feeds")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedDto[];
};

export const getFeedsWithProfile = async (
  params?: FeedListParams,
): Promise<FeedWithProfile[]> => {
  const { limit = 20, offset = 0 } = params || {};

  const { data, error } = await supabase
    .from("feeds")
    .select(
      `
      *,
      user_profiles:user_profiles!feeds_user_id_profile_fkey(
        nickname,
        profile_image_url
      )
    `,
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedWithProfile[];
};

export const getFeedPostCards = async (
  params?: FeedListParams,
): Promise<FeedPostCardDto[]> => {
  const feeds = await getFeedsWithProfile(params);
  const feedIds = feeds.map((feed) => feed.id);
  const [likedFeedMap, bookmarkedFeedMap] = await Promise.all([
    getFeedLikes(feedIds),
    getAreBookmarked(feedIds),
  ]);

  return feeds.map((feed) =>
    toFeedPostCard(feed, likedFeedMap, bookmarkedFeedMap),
  );
};
