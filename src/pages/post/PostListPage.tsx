import PostItemCard from "@/entities/post/ui/PostItemCard";
import { postsData } from "@/shared/mocks/post";

export default function PostListPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="max-w-[470px] mx-auto">
        {/* 게시글 리스트 섹션 */}
        <section className="flex flex-col">
          {postsData.map((post) => (
            <PostItemCard key={post.id} {...post} />
          ))}
        </section>
      </div>
    </main>
  );
}
