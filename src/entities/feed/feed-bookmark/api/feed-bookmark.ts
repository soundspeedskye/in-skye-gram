import { supabase } from "@/shared/api/supabase";
import type {
  FeedBookmarkDto,
  FeedBookmarkParams,
} from "../model/feed-bookmark.dto";

// 북마크 목록 조회
export const getFeedBookmarks = async (
  params: FeedBookmarkParams,
): Promise<FeedBookmarkDto[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not found");

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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");
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
