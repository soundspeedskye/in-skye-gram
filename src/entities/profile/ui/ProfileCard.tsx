import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/lib/avatar";
import { Button } from "@/shared/ui/lib/button";
import { Settings, UserCheck } from "lucide-react";
import type { ProfileDto } from "@/entities/profile/model/profile.dto";

interface ProfileCardProps {
  profile: ProfileDto;
  description?: string;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
}

const ProfileCard = ({
  profile,
  description,
  isOwnProfile = false,
  onEditProfile,
  onFollow,
  onMessage,
}: ProfileCardProps) => {
  return (
    <div className="flex flex-col gap-6 mb-6 md:flex-row">
      {/* 프로필 이미지 */}
      <div className="flex justify-center md:justify-start">
        <Avatar className="w-32 h-32 md:w-40 md:h-40">
          <AvatarImage src={profile.avatar} alt={profile.username} />
          <AvatarFallback className="text-3xl">
            {profile.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 프로필 정보 */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col items-center gap-4 mb-4 md:flex-row">
          <h1 className="text-2xl font-light">{profile.username}</h1>
          {profile.isVerified && (
            <div className="text-blue-500">
              <UserCheck className="w-5 h-5" />
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <Button variant="outline" size="sm" onClick={onEditProfile}>
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={profile.isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={onFollow}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" size="sm" onClick={onMessage}>
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 통계 */}
        <div className="flex justify-center gap-8 mb-4 md:justify-start">
          <div className="text-center">
            <span className="block font-semibold">{profile.postsCount}</span>
            <span className="text-sm text-gray-600">posts</span>
          </div>
          <div className="text-center">
            <span className="block font-semibold">
              {profile.followersCount.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">followers</span>
          </div>
          <div className="text-center">
            <span className="block font-semibold">
              {profile.followingCount}
            </span>
            <span className="text-sm text-gray-600">following</span>
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="space-y-1">
          <h2 className="font-semibold">{profile.fullName}</h2>
          {description && (
            <p className="text-sm whitespace-pre-wrap">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
