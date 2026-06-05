import { getFeedByIdWithProfile } from "@/entities/feed/feed-list/api/get-feed-single";
import { getFeedsWithProfile } from "@/entities/feed/feed-list/api/get-feed-list";
import type {
  FeedListParams,
  FeedProfileDto,
  FeedWithProfile as FeedWithProfileRow,
} from "@/entities/feed/feed-list/model/feed.dto";
import { getAreBookmarked, getIsBookmarked } from "@/entities/feed/feed-bookmark/api/feed-bookmark";
import { getFeedLike, getFeedLikes } from "@/entities/feed/feed-like/api/feed-like";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type Feed = Camelize<Tables<"feeds">>;
export type FeedProfile = Camelize<FeedProfileDto>;

export interface FeedWithProfile extends Feed {
  userProfiles: FeedProfile;
}

export interface FeedWithStatus extends FeedWithProfile {
  isLiked: boolean;
  isBookmarked: boolean;
}

const getFirstRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

const toFeedWithProfile = (feed: FeedWithProfileRow): FeedWithProfile => {
  const camelized = toCamelCase<FeedWithProfile>(feed);
  const profile = getFirstRelation(feed.user_profiles);

  return {
    ...camelized,
    userProfiles: toCamelCase<FeedProfile>(
      profile ?? { nickname: null, profile_image_url: null },
    ),
  };
};

export const getFeedsWithStatus = async (
  params: FeedListParams = {},
): Promise<FeedWithStatus[]> => {
  const baseFeeds = await getFeedsWithProfile({ limit: 10, ...params });
  if (baseFeeds.length === 0) return [];

  const feedIds = baseFeeds.map((feed) => feed.id);

  const [likedMap, bookmarkedMap] = await Promise.all([
    getFeedLikes(feedIds),
    getAreBookmarked(feedIds),
  ]);

  return baseFeeds.map((feed) => ({
    ...toFeedWithProfile(feed),
    isLiked: Boolean(likedMap[feed.id]),
    isBookmarked: Boolean(bookmarkedMap[feed.id]),
  }));
};

export const getFeedWithStatus = async (
  feedId: number,
): Promise<FeedWithStatus | null> => {
  const baseFeed = await getFeedByIdWithProfile(feedId);
  if (!baseFeed) return null;

  const [isLiked, isBookmarked] = await Promise.all([
    getFeedLike(feedId),
    getIsBookmarked(feedId),
  ]);

  return {
    ...toFeedWithProfile(baseFeed),
    isLiked,
    isBookmarked,
  };
};
