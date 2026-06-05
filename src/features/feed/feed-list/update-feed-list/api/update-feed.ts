import { requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import type { TablesUpdate } from "@/shared/api/supabase.types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type Feed = Camelize<Tables<"feeds">>;

export interface UpdateFeedParams {
  caption?: string;
}

export const updateFeed = async (
  feedId: number,
  params: UpdateFeedParams,
): Promise<Feed> => {
  const user = await requireCurrentUser();

  const { data: existingFeed, error: fetchError } = await supabase
    .from("feeds")
    .select("user_id")
    .eq("id", feedId)
    .single();

  if (fetchError) throw fetchError;
  if (existingFeed.user_id !== user.id) {
    throw new Error("Not authorized to update this feed");
  }

  const updatePayload: TablesUpdate<"feeds"> = {};
  if (params.caption !== undefined) updatePayload.caption = params.caption;

  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No fields to update");
  }

  const { data, error } = await supabase
    .from("feeds")
    .update(updatePayload)
    .eq("id", feedId)
    .select()
    .single();

  if (error) throw error;
  return toCamelCase<Feed>(data);
};
