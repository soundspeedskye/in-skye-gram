import { feedImageStorage } from "@/shared/api/imageStorage";
import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";

export const deleteFeed = async (feedId: number): Promise<void> => {
  const user = await requireCurrentUser();

  const { data: existingFeed, error: fetchError } = await supabase
    .from("feeds")
    .select("id, user_id")
    .eq("id", feedId)
    .single();

  if (fetchError) throw fetchError;
  if (existingFeed.user_id !== user.id) {
    throw new Error("Not authorized to delete this feed");
  }

  const { error: deleteError } = await supabase
    .from("feeds")
    .delete()
    .eq("id", feedId);

  if (deleteError) throw deleteError;

  await feedImageStorage.removeAll(user.id, feedId);
};
