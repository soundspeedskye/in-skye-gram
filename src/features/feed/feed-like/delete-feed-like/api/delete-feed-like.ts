import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";

export const deleteFeedLike = async (feed_id: number): Promise<void> => {
  const user = await requireCurrentUser();

  const { error } = await supabase
    .from("feed_likes")
    .delete()
    .eq("feed_id", feed_id)
    .eq("user_id", user.id);

  if (error) throw error;
};
