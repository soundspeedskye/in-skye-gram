import { Button } from "@/shared/ui/lib/button";
import { Card, CardContent } from "@/shared/ui/lib/card";
import { Grid3x3, Bookmark, Heart, MessageCircle } from "lucide-react";
import type { PostDto } from "@/entities/post/model/post.dto";

interface MyPostCardProps {
  posts: PostDto[];
  activeTab?: "posts" | "saved";
  onTabChange?: (tab: "posts" | "saved") => void;
  onPostClick?: (post: PostDto) => void;
}

const MyPostCard = ({
  posts,
  activeTab = "posts",
  onTabChange,
  onPostClick,
}: MyPostCardProps) => {
  return (
    <>
      {/* 탭 메뉴 */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => onTabChange?.("posts")}
            className={`flex items-center gap-2 py-4 ${
              activeTab === "posts"
                ? "border-t-2 border-black"
                : "text-gray-500"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">POSTS</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => onTabChange?.("saved")}
            className={`flex items-center gap-2 py-4 ${
              activeTab === "saved"
                ? "border-t-2 border-black"
                : "text-gray-500"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">SAVED</span>
          </Button>
        </div>
      </div>

      {/* 포스트 그리드 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4 mt-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="aspect-square overflow-hidden border-none rounded-none md:rounded-lg cursor-pointer group relative"
              onClick={() => onPostClick?.(post)}
            >
              <CardContent className="p-0 h-full relative">
                <img
                  src={post.postImage}
                  alt={`Post by ${post.username}`}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />

                {/* 호버 시 표시되는 통계 */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="w-6 h-6 fill-current" />
                      <span className="font-semibold">
                        {post.likes?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-6 h-6 fill-current" />
                      <span className="font-semibold">
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* 포스트가 없을 때 */
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
            {activeTab === "posts" ? (
              <Grid3x3 className="w-8 h-8" />
            ) : (
              <Bookmark className="w-8 h-8" />
            )}
          </div>
          <h3 className="text-xl font-light mb-2">
            {activeTab === "posts" ? "No Posts Yet" : "No Saved Posts"}
          </h3>
          <p className="text-gray-500">
            {activeTab === "posts"
              ? "When you share photos, they will appear on your profile."
              : "Save photos and videos to see them here."}
          </p>
        </div>
      )}
    </>
  );
};

export default MyPostCard;
