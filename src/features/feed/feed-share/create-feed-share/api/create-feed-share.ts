import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type FeedShare = Camelize<Tables<"feed_shares">>;

export const createFeedShare = async (
  feed_id: number,
): Promise<FeedShare> => {
  const user = await requireCurrentUser();

  // insert만 수행 → 중복 허용
  const { data, error } = await supabase
    .from("feed_shares")
    .insert([{ feed_id, user_id: user.id }])
    .select()
    .single(); // 한 행만 반환

  if (error) throw error;
  return toCamelCase<FeedShare>(data);
};
