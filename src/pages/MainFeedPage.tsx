import StoryListPage from "@/pages/story/StoryListPage";
import PostListPage from "@/pages/post/PostListPage";
import MainSideBarSheet from "@/shared/ui/core/MainSideBarSheet";

export default function MainFeedPage() {
  return (
    <div className="w-full min-h-screen ">
      {/* 1. 사이드바 영역: 화면 왼쪽에 고정 */}
      <aside className="fixed top-0 left-0 z-50 h-full">
        <MainSideBarSheet />
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="ml-[72px] md:ml-[240px] transition-all duration-300">
        <div className="w-full max-w-[470px] mx-auto px-4 md:px-0">
          {/* 상단 스토리 */}
          <StoryListPage />

          {/* 게시글 피드 리스트 */}
          <PostListPage />
        </div>
      </main>
    </div>
  );
}
