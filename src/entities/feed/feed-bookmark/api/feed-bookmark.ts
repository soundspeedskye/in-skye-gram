import { supabase } from "@/shared/api/supabase";
import { getCurrentUser, requireCurrentUser } from "@/shared/api/auth-utils";
import type { FeedDto } from "@/entities/feed/feed-list/model/feed.dto";
import type {
  FeedBookmarkDto,
  FeedBookmarkParams,
} from "../model/feed-bookmark.dto";

// 북마크 목록 조회
export const getFeedBookmarks = async (
  params: FeedBookmarkParams,
): Promise<FeedBookmarkDto[]> => {
  const user = await requireCurrentUser();

  const { limit = 10, offset = 0 } = params;

  const { data, error } = await supabase
    .from("feed_bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedBookmarkDto[];
};

// 특정 북마크 확인
export const getIsBookmarked = async (feedId: number): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("feed_bookmarks")
    .select("feed_id")
    .eq("feed_id", feedId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data ? true : false;
};

// 여러 피드에 대한 북마크 여부
export const getAreBookmarked = async (
  feedIds: number[],
): Promise<Record<number, boolean>> => {
  const user = await getCurrentUser();
  if (!user) return {};

  if (feedIds.length === 0) return {};

  const { data, error } = await supabase
    .from("feed_bookmarks")
    .select("feed_id")
    .eq("user_id", user.id)
    .in("feed_id", feedIds);

  if (error) throw error;

  const result: Record<number, boolean> = {};
  feedIds.forEach((id) => {
    result[id] = false;
  });

  data?.forEach((bookmark) => {
    result[bookmark.feed_id] = true;
  });
  return result;
};

// 내가 북마크한 피드 목록 조회
export const getBookmarkedFeeds = async (
  params: FeedBookmarkParams,
): Promise<FeedBookmarkDto[]> => {
  const user = await requireCurrentUser();
  const { limit = 10, offset = 0 } = params;

  const { data, error } = await supabase
    .from("feed_bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as FeedBookmarkDto[];
};

export const getBookmarkedFeedList = async (
  params: FeedBookmarkParams,
): Promise<FeedDto[]> => {
  const bookmarks = await getBookmarkedFeeds(params);
  const feedIds = bookmarks.map((bookmark) => bookmark.feed_id);

  if (feedIds.length === 0) return [];

  const { data, error } = await supabase
    .from("feeds")
    .select("*")
    .in("id", feedIds);

  if (error) throw error;

  const feedById = new Map((data ?? []).map((feed) => [feed.id, feed]));

  return feedIds
    .map((feedId) => feedById.get(feedId))
    .filter((feed): feed is FeedDto => Boolean(feed));
};
