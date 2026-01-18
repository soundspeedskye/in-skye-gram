export interface ProfileDto {
  id: string;
  username: string;
  fullName: string;
  description: string;
  avatar: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  canMessage?: boolean;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  description?: string;
  isPrivate?: boolean;
  avatar?: File;
}

export interface ProfileStatsDto {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface FollowDto {
  userId: string;
  targetUserId: string;
  action: "follow" | "unfollow";
}

export interface BlockDto {
  userId: string;
  targetUserId: string;
  action: "block" | "unblock";
}
