import PostItemCard from "@/entities/feed/feed-list/ui/PostItemCard";
import { getFeedPostCards } from "@/entities/feed/feed-list/api/get-feed-list";
import { Skeleton } from "@/shared/ui/lib/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function PostListPage() {
  const {
    data: posts,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["feed-post-cards", "list"],
    queryFn: () => getFeedPostCards({ limit: 20 }),
  });

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-[470px] mx-auto">
        <section className="flex flex-col">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="max-w-[470px] mx-auto mb-6 w-full overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center gap-3 p-3.5">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}

          {isError && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
              피드를 불러오지 못했습니다.
              {error instanceof Error && (
                <span className="mt-1 block text-xs text-red-600">
                  {error.message}
                </span>
              )}
            </div>
          )}

          {!isLoading && !isError && (posts?.length ?? 0) === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
              아직 표시할 게시글이 없습니다.
            </div>
          )}

          {posts?.map((post) => (
            <PostItemCard key={post.id} post={post} />
          ))}
        </section>
      </div>
    </main>
  );
}
