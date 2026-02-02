import { supabase } from "@/shared/api/supabase";

export const deleteFeedBookmark = async (feedId: number): Promise<void> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("feed_bookmarks")
    .delete()
    .eq("feed_id", feedId)
    .eq("user_id", user.id);

  if (error) throw error;
};
