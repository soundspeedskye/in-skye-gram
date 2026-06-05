import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";

export const deleteFeedBookmark = async (feedId: number): Promise<void> => {
  const user = await requireCurrentUser();

  const { error } = await supabase
    .from("feed_bookmarks")
    .delete()
    .eq("feed_id", feedId)
    .eq("user_id", user.id);

  if (error) throw error;
};
