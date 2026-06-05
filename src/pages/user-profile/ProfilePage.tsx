import { useState } from "react";
import MyPostCard from "@/widgets/profile/ui/MyPostCard";
import MainSideBarSheet from "@/shared/ui/core/MainSideBarSheet";
import type { FeedDto } from "@/entities/feed/feed-list/model/feed.dto";
import { getFeedsByUserId } from "@/entities/feed/feed-list/api/get-feed-single";
import { getBookmarkedFeedList } from "@/entities/feed/feed-bookmark/api/feed-bookmark";
import { getCurrentUserProfile } from "@/entities/user-profiles/api/get-user-profiles";
import ProfileCard from "@/entities/user-profiles/ui/ProfileCard";
import { updateUserProfile } from "@/features/user-profiles/update-user-profiles/api/update-user-profiles";
import type { UpdateUserProfileDto } from "@/features/user-profiles/update-user-profiles/model/update-user-profiles.dto";
import UpdateUserProfilesForm from "@/features/user-profiles/update-user-profiles/ui/UpdateUserProfilesForm";
import { Skeleton } from "@/shared/ui/lib/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/lib/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: currentProfile,
    error: profileError,
    isError: isProfileError,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
  });

  const { data: userPosts = [], isLoading: isUserPostsLoading } = useQuery({
    queryKey: ["profile-posts", currentProfile?.user_id],
    queryFn: () => getFeedsByUserId(currentProfile!.user_id, 50),
    enabled: Boolean(currentProfile?.user_id),
  });

  const { data: savedPosts = [], isLoading: isSavedPostsLoading } = useQuery({
    queryKey: ["profile-saved-posts", currentProfile?.user_id],
    queryFn: () => getBookmarkedFeedList({ limit: 50 }),
    enabled: Boolean(currentProfile?.user_id) && activeTab === "saved",
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      setIsEditProfileOpen(false);
      queryClient.invalidateQueries({ queryKey: ["current-user-profile"] });
    },
  });

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleProfileUpdate = (data: UpdateUserProfileDto) => {
    updateProfileMutation.mutate(data);
  };

  const handlePostClick = (post: FeedDto) => {
    console.log("Post clicked:", post);
    // 포스트 상세 보기 등의 로직
  };

  const postsToShow = activeTab === "posts" ? userPosts : savedPosts;
  const isPostsLoading =
    activeTab === "posts" ? isUserPostsLoading : isSavedPostsLoading;

  return (
    <div className="w-full min-h-screen">
      {/* 1. 사이드바 영역: 화면 왼쪽에 고정 */}
      <aside className="fixed top-0 left-0 z-50 h-full">
        <MainSideBarSheet />
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="ml-[72px] md:ml-[240px] transition-all duration-300">
        <div className="flex-1 max-w-4xl p-6 mx-auto">
          {isProfileLoading && (
            <div className="flex flex-col gap-6 mb-6 md:flex-row">
              <Skeleton className="mx-auto h-32 w-32 rounded-full md:mx-0 md:h-40 md:w-40" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-52" />
              </div>
            </div>
          )}

          {isProfileError && (
            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-700">
              프로필을 불러오지 못했습니다.
              {profileError instanceof Error && (
                <span className="mt-1 block text-xs text-red-600">
                  {profileError.message}
                </span>
              )}
            </div>
          )}

          {!isProfileLoading && !isProfileError && !currentProfile && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
              로그인 후 프로필을 확인할 수 있습니다.
            </div>
          )}

          {currentProfile && (
            <>
              <ProfileCard
                userProfile={currentProfile}
                onEditProfile={handleEditProfile}
              />
              <Dialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
              >
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>프로필 편집</DialogTitle>
                  </DialogHeader>
                  <UpdateUserProfilesForm
                    key={[
                      currentProfile.user_id,
                      currentProfile.nickname,
                      currentProfile.description,
                      currentProfile.profile_image_url,
                    ].join(":")}
                    initialProfile={currentProfile}
                    isLoading={updateProfileMutation.isPending}
                    apiError={
                      updateProfileMutation.error instanceof Error
                        ? updateProfileMutation.error
                        : null
                    }
                    onCancel={() => setIsEditProfileOpen(false)}
                    onSubmit={handleProfileUpdate}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}

          {currentProfile && (
            <>
              {isPostsLoading ? (
                <div className="grid grid-cols-3 gap-1 mt-6 md:gap-4">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-square w-full" />
                  ))}
                </div>
              ) : (
                <MyPostCard
                  posts={postsToShow}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onPostClick={handlePostClick}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
