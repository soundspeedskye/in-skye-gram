import { supabase } from "@/shared/api/supabase";

export const deleteFeedLike = async (feed_id: number): Promise<void> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("feed_likes")
    .delete()
    .eq("feed_id", feed_id)
    .eq("user_id", user.id);

  if (error) throw error;
};
