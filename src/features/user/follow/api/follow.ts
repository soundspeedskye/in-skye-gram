import { getCurrentUser, requireCurrentUser } from "@/shared/api/auth-utils";
import { supabase } from "@/shared/api/supabase";
import type { Camelize, Tables } from "@/shared/api/types";
import { toCamelCase } from "@/shared/lib/utils/case";

export type Follow = Camelize<Tables<"follows">>;
export type FollowProfileRow = Pick<
  Tables<"user_profiles">,
  "user_id" | "nickname" | "profile_image_url"
>;
export type FollowProfile = Camelize<FollowProfileRow>;

export interface FollowWithProfile extends Follow {
  followerProfile: FollowProfile;
  followingProfile: FollowProfile;
}

export interface GetFollowsParams {
  limit?: number;
  offset?: number;
}

export interface FollowCounts {
  followerCount: number;
  followingCount: number;
}

export const followUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc("follow_user", {
    target_user_id: userId,
  });

  if (error) {
    if (error.message.includes("Already following")) {
      throw new Error("Already following this user");
    }
    if (error.message.includes("Cannot follow yourself")) {
      throw new Error("Cannot follow yourself");
    }
    throw error;
  }
};

export const unfollowUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc("unfollow_user", {
    target_user_id: userId,
  });

  if (error) {
    if (error.message.includes("Not following")) {
      throw new Error("Not following this user");
    }
    throw error;
  }
};

export const getIsFollowing = async (userId: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
};

export const getAreFollowing = async (
  userIds: string[],
): Promise<Record<string, boolean>> => {
  const user = await getCurrentUser();
  if (!user) return {};

  if (userIds.length === 0) return {};

  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .in("following_id", userIds);

  if (error) throw error;

  const result: Record<string, boolean> = {};
  userIds.forEach((id) => {
    result[id] = false;
  });

  data?.forEach((follow) => {
    result[follow.following_id] = true;
  });

  return result;
};

export const getFollowers = async (
  params: GetFollowsParams = {},
): Promise<FollowWithProfile[]> => {
  const user = await requireCurrentUser();
  const { limit = 10, offset = 0 } = params;

  const { data, error } = await supabase
    .from("follows")
    .select(
      `
      *,
      follower_profile:user_profiles!follows_follower_profile_fkey (
        user_id,
        nickname,
        profile_image_url
      )
    `,
    )
    .eq("following_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return toCamelCase<FollowWithProfile[]>(data);
};

export const getFollowings = async (
  params: GetFollowsParams = {},
): Promise<FollowWithProfile[]> => {
  const user = await requireCurrentUser();
  const { limit = 10, offset = 0 } = params;

  const { data, error } = await supabase
    .from("follows")
    .select(
      `
      *,
      following_profile:user_profiles!follows_following_profile_fkey (
        user_id,
        nickname,
        profile_image_url
      )
    `,
    )
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return toCamelCase<FollowWithProfile[]>(data);
};

export const getFollowCounts = async (
  userId?: string,
): Promise<FollowCounts> => {
  let targetUserId = userId;

  if (!targetUserId) {
    const user = await requireCurrentUser();
    targetUserId = user.id;
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("follower_count, following_count")
    .eq("user_id", targetUserId)
    .single();

  if (error) throw error;

  return {
    followerCount: profile.follower_count,
    followingCount: profile.following_count,
  };
};

export const followAPI = {
  follow: followUser,
  unfollow: unfollowUser,
  isFollowing: getIsFollowing,
  areFollowing: getAreFollowing,
  getFollowers,
  getFollowings,
  getFollowCounts,
};
