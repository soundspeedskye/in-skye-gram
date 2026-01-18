import { useState } from "react";
import ProfileCard from "@/entities/profile/ui/ProfileCard";
import MyPostCard from "@/widgets/profile/ui/MyPostCard";
import MainSideBarSheet from "@/shared/ui/core/MainSideBarSheet";
import { mockProfile } from "@/shared/mocks/profile";
import { postsData } from "@/shared/mocks/post";
import type { PostDto } from "@/entities/post/model/post.dto";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const user = mockProfile;
  const userPosts = postsData.slice(0, 9); // 9개의 포스트만 표시
  const savedPosts: PostDto[] = []; // 저장된 포스트 (임시로 빈 배열)

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // 프로필 편집 모달 열기 등의 로직
  };

  const handlePostClick = (post: PostDto) => {
    console.log("Post clicked:", post);
    // 포스트 상세 보기 등의 로직
  };

  const postsToShow = activeTab === "posts" ? userPosts : savedPosts;

  return (
    <div className="w-full min-h-screen">
      {/* 1. 사이드바 영역: 화면 왼쪽에 고정 */}
      <aside className="fixed top-0 left-0 z-50 h-full">
        <MainSideBarSheet />
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="w-full ml-[72px] md:ml-[240px] transition-all duration-300">
        <div className="flex-1 max-w-4xl p-6 mx-auto">
          {/* 프로필 헤더 */}
          <ProfileCard
            profile={user}
            isOwnProfile={true}
            onEditProfile={handleEditProfile}
          />

          {/* 포스트 그리드 */}
          <MyPostCard
            posts={postsToShow}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onPostClick={handlePostClick}
          />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
