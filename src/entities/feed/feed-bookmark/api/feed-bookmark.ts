import { supabase } from "@/shared/api/supabase";
import type {
  FeedBookmarkDto,
  CreateFeedBookmarkDto,
  DeleteFeedBookmarkDto,
  FeedBookmarkParams,
} from "../model/feed-bookmark.dto";

// 북마크 목록 조회
export const getFeedBookmarks = async (
  params?: FeedBookmarkParams,
): Promise<FeedBookmarkDto[]> => {
  let query = supabase
    .from("feed_bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.feed_id) {
    query = query.eq("feed_id", params.feed_id);
  }

  if (params?.user_id) {
    query = query.eq("user_id", params.user_id);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FeedBookmarkDto[];
};

// 특정 북마크 확인
export const getFeedBookmark = async (
  feed_id: number,
  user_id: string,
): Promise<FeedBookmarkDto | null> => {
  const { data, error } = await supabase
    .from("feed_bookmarks")
    .select("*")
    .eq("feed_id", feed_id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as FeedBookmarkDto;
};

// 북마크 생성
export const createFeedBookmark = async (
  bookmark: CreateFeedBookmarkDto,
): Promise<FeedBookmarkDto> => {
  const { data, error } = await supabase
    .from("feed_bookmarks")
    .insert(bookmark)
    .select()
    .single();

  if (error) throw error;
  return data as FeedBookmarkDto;
};

// 북마크 삭제
export const deleteFeedBookmark = async (
  bookmark: DeleteFeedBookmarkDto,
): Promise<void> => {
  const { error } = await supabase
    .from("feed_bookmarks")
    .delete()
    .eq("feed_id", bookmark.feed_id)
    .eq("user_id", bookmark.user_id);

  if (error) throw error;
};

// 북마크 토글
export const toggleFeedBookmark = async (
  feed_id: number,
  user_id: string,
): Promise<{ isBookmarked: boolean }> => {
  const existingBookmark = await getFeedBookmark(feed_id, user_id);

  if (existingBookmark) {
    await deleteFeedBookmark({ feed_id, user_id });
    return { isBookmarked: false };
  } else {
    await createFeedBookmark({ feed_id, user_id });
    return { isBookmarked: true };
  }
};
