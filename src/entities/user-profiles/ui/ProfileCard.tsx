import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/lib/avatar";
import { Button } from "@/shared/ui/lib/button";
import { Settings, UserCheck } from "lucide-react";
import type { UserProfilesDto } from "../model/user-profiles.dto";

interface Props {
  userProfile: UserProfilesDto;
  onEditProfile: () => void;
}

const ProfileCard = ({ userProfile, onEditProfile }: Props) => {
  const displayName = userProfile.nickname || "익명 사용자";
  const displayImage =
    userProfile.profile_image_url ||
    `https://picsum.photos/160/160?random=${userProfile.user_id}`;

  return (
    <div className="flex flex-col gap-6 mb-6 md:flex-row">
      {/* 프로필 이미지 */}
      <div className="flex justify-center md:justify-start">
        <Avatar className="w-32 h-32 md:w-40 md:h-40">
          <AvatarImage src={displayImage} alt={displayName} />{" "}
          <AvatarFallback className="text-3xl">
            {displayName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 프로필 정보 */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col items-center gap-4 mb-4 md:flex-row">
          <h1 className="text-2xl font-light">{displayName}</h1>
          <div className="text-blue-500">
            <UserCheck className="w-5 h-5" />
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEditProfile}>
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 통계 */}
        <div className="flex justify-center gap-8 mb-4 md:justify-start">
          <div className="text-center">
            <span className="block font-semibold">
              {userProfile.post_count}
            </span>
            <span className="text-sm text-gray-600">posts</span>
          </div>
          <div className="text-center">
            <span className="block font-semibold">
              {userProfile.follower_count.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">followers</span>
          </div>
          <div className="text-center">
            <span className="block font-semibold">
              {userProfile.following_count}
            </span>
            <span className="text-sm text-gray-600">following</span>
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="space-y-1">
          {userProfile.description && (
            <p className="text-sm whitespace-pre-wrap">
              {userProfile.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
