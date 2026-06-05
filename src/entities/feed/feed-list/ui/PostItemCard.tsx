import { type FormEvent, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/ui/lib/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/lib/avatar";
import { Button } from "@/shared/ui/lib/button";
import { Separator } from "@/shared/ui/lib/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/shared/ui/lib/dialog";
import { cn } from "@/app/style/utils";
import type { FeedPostCardDto } from "@/entities/feed/feed-list/model/feed.dto";
import { getFeedCommentsWithProfile } from "@/entities/feed/feed-comment/api/feed-comment";
import { createFeedBookmark } from "@/features/feed/feed-bookmark/create-feed-bookmark/api/create-feed-bookmark";
import { deleteFeedBookmark } from "@/features/feed/feed-bookmark/delete-feed-bookmark/api/delete-feed-bookmark";
import { createFeedComment } from "@/features/feed/feed-comment/create-feed-comment/api/create-feed-comment";
import { createFeedLike } from "@/features/feed/feed-like/create-feed-like/api/create-feed-like";
import { deleteFeedLike } from "@/features/feed/feed-like/delete-feed-like/api/delete-feed-like";
import { createFeedShare } from "@/features/feed/feed-share/create-feed-share/api/create-feed-share";
import type {
  FeedCommentProfileDto,
  FeedCommentWithProfile,
} from "@/entities/feed/feed-comment/model/feed-comment.dto";
import { formatTimeAgo } from "@/shared/ui/lib/functions/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PostItemCardProps {
  post: FeedPostCardDto;
  onToggleLike?: (postId: FeedPostCardDto["id"]) => void;
  onToggleBookmark?: (postId: FeedPostCardDto["id"]) => void;
  onOpenComments?: (postId: FeedPostCardDto["id"]) => void;
}

interface InteractionOverride {
  snapshotKey: string;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  commentsCount: number;
}

export default function PostItemCard({
  post,
  onToggleLike,
  onToggleBookmark,
  onOpenComments,
}: PostItemCardProps) {
  const username = post.author.nickname;
  const userAvatar = post.author.profileImageUrl ?? "";
  const postImage = post.images[0] ?? "";
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [interactionOverride, setInteractionOverride] =
    useState<InteractionOverride | null>(null);
  const queryClient = useQueryClient();

  const snapshotKey = [
    post.id,
    post.viewer.isLiked,
    post.viewer.isBookmarked,
    post.counts.likes,
    post.counts.comments,
  ].join(":");
  const activeInteraction =
    interactionOverride?.snapshotKey === snapshotKey
      ? interactionOverride
      : {
          snapshotKey,
          isLiked: post.viewer.isLiked,
          isSaved: post.viewer.isBookmarked,
          likesCount: post.counts.likes,
          commentsCount: post.counts.comments,
        };
  const { isLiked, isSaved, likesCount, commentsCount } = activeInteraction;

  const {
    data: comments = [],
    isError: isCommentsError,
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ["feed-comments", post.id],
    queryFn: () => getFeedCommentsWithProfile(post.id),
    enabled: isCommentsOpen,
  });

  const likeMutation = useMutation<
    void,
    Error,
    boolean,
    { interactionOverride: InteractionOverride | null }
  >({
    mutationFn: async (nextLiked) => {
      if (nextLiked) {
        await createFeedLike(post.id);
        return;
      }

      await deleteFeedLike(post.id);
    },
    onMutate: (nextLiked) => {
      const previous = { interactionOverride };

      setInteractionOverride({
        ...activeInteraction,
        isLiked: nextLiked,
        likesCount: Math.max(
          0,
          activeInteraction.likesCount + (nextLiked ? 1 : -1),
        ),
      });

      return previous;
    },
    onError: (_error, _nextLiked, previous) => {
      if (!previous) return;
      setInteractionOverride(previous.interactionOverride);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-post-cards"] });
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
      queryClient.invalidateQueries({ queryKey: ["profile-saved-posts"] });
    },
  });

  const bookmarkMutation = useMutation<
    void,
    Error,
    boolean,
    { interactionOverride: InteractionOverride | null }
  >({
    mutationFn: async (nextSaved) => {
      if (nextSaved) {
        await createFeedBookmark(post.id);
        return;
      }

      await deleteFeedBookmark(post.id);
    },
    onMutate: (nextSaved) => {
      const previous = { interactionOverride };

      setInteractionOverride({
        ...activeInteraction,
        isSaved: nextSaved,
      });

      return previous;
    },
    onError: (_error, _nextSaved, previous) => {
      if (!previous) return;
      setInteractionOverride(previous.interactionOverride);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-post-cards"] });
      queryClient.invalidateQueries({ queryKey: ["profile-saved-posts"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      createFeedComment({ feedId: post.id, content }),
    onMutate: () => {
      setCommentError(null);
    },
    onSuccess: () => {
      setCommentContent("");
      setInteractionOverride((currentOverride) => {
        const currentInteraction =
          currentOverride?.snapshotKey === snapshotKey
            ? currentOverride
            : activeInteraction;

        return {
          ...currentInteraction,
          commentsCount: currentInteraction.commentsCount + 1,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["feed-comments", post.id] });
      queryClient.invalidateQueries({ queryKey: ["feed-post-cards"] });
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
      queryClient.invalidateQueries({ queryKey: ["profile-saved-posts"] });
    },
    onError: (error) => {
      setCommentError(
        error instanceof Error
          ? error.message
          : "댓글 등록에 실패했습니다.",
      );
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      await createFeedShare(post.id);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-post-cards"] });
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
      queryClient.invalidateQueries({ queryKey: ["profile-saved-posts"] });
    },
  });

  const handleLike = () => {
    if (likeMutation.isPending) return;
    likeMutation.mutate(!isLiked);
    onToggleLike?.(post.id);
  };

  const handleBookmark = () => {
    if (bookmarkMutation.isPending) return;
    bookmarkMutation.mutate(!isSaved);
    onToggleBookmark?.(post.id);
  };

  const handleShare = () => {
    if (shareMutation.isPending) return;
    shareMutation.mutate();
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = commentContent.trim();
    if (!content || commentMutation.isPending) return;

    commentMutation.mutate(content);
  };

  const renderCommentComposer = (className = "p-4 pt-2 border-t") => (
    <form onSubmit={handleCommentSubmit} className={className}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={commentContent}
          onChange={(event) => setCommentContent(event.target.value)}
          placeholder="Add a comment..."
          disabled={commentMutation.isPending}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 disabled:opacity-60"
          maxLength={2200}
        />
        {commentContent.trim() && (
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={commentMutation.isPending}
            className="h-auto p-0 text-sm font-semibold text-blue-500 hover:bg-transparent hover:text-blue-600 disabled:opacity-50"
          >
            {commentMutation.isPending ? "게시 중..." : "게시"}
          </Button>
        )}
      </div>
      {commentError && (
        <p className="mt-2 text-xs text-red-600">{commentError}</p>
      )}
    </form>
  );

  const getCommentProfile = (
    profile: FeedCommentProfileDto | FeedCommentProfileDto[] | null,
  ) => {
    if (Array.isArray(profile)) return profile[0] ?? null;
    return profile;
  };

  const renderComment = (comment: FeedCommentWithProfile) => {
    const profile = getCommentProfile(comment.user_profiles);
    const commentUsername = profile?.nickname?.trim() || comment.user_id;
    const commentAvatar = profile?.profile_image_url ?? "";

    return (
      <div key={comment.id} className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 mt-1">
            <AvatarImage src={commentAvatar} alt={commentUsername} />
            <AvatarFallback>
              {commentUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm">
              <span className="mr-1 font-semibold">{commentUsername}</span>
              {comment.content}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {formatTimeAgo(comment.created_at)}
            </div>
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-10 space-y-3">
            {comment.replies.map(renderComment)}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="max-w-[470px] mx-auto mb-6 border border-gray-200 rounded-lg shadow-none bg-white">
      <CardHeader className="p-3.5 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userAvatar} alt={username} />
              <AvatarFallback>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-900">
                {username}
              </span>
              {post.author.isVerified && (
                <div className="flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full">
                  <span className="text-[10px] text-white">✓</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="border-0 bg-transparent p-2 hover:border-transparent hover:bg-transparent focus:outline-none focus-visible:outline-none"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="mt-3">
        <img
          src={postImage}
          alt=""
          className="object-cover w-full aspect-square"
        />
      </div>

      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-4">
          <Button
            variant="post"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={cn(isLiked && "text-red-500")}
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
          </Button>

          {/* Comment Dialog */}
          <Dialog
            open={isCommentsOpen}
            onOpenChange={(open) => {
              setIsCommentsOpen(open);
              if (open) onOpenComments?.(post.id);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="post">
                <MessageCircle className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="bg-white p-0 overflow-hidden w-[95vw] h-[85vh] max-w-5xl md:max-w-[1100px]"
            >
              <DialogTitle className="sr-only">Post Details</DialogTitle>
              <DialogClose
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
              <div className="flex w-full h-full flex-col md:flex-row">
                {/* 왼쪽: 이미지 */}
                <div className="relative flex h-1/2 min-h-0 items-center justify-center overflow-hidden bg-black md:h-full md:flex-1 md:min-w-0">
                  <img
                    src={postImage}
                    alt="post content"
                    className="block object-contain w-full h-full"
                  />
                </div>

                {/* 오른쪽: 게시글 정보 및 댓글 */}
                <div className="flex h-1/2 w-full flex-col bg-white border-t md:h-full md:w-[400px] md:border-l md:border-t-0">
                  {/* 헤더 */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userAvatar} alt={username} />
                        <AvatarFallback>
                          {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {username}
                        </span>
                        {post.author.isVerified && (
                          <div className="flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full">
                            <span className="text-[10px] text-white">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 댓글 영역 */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {/* 게시글 내용 */}
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarImage src={userAvatar} alt={username} />
                          <AvatarFallback>
                            {username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="mr-1 font-semibold">
                              {username}
                            </span>
                            {post.caption}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {formatTimeAgo(post.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 댓글들 */}
                    <div className="space-y-4">
                      {isCommentsLoading && (
                        <div className="text-sm text-gray-500">
                          댓글을 불러오는 중입니다.
                        </div>
                      )}

                      {isCommentsError && (
                        <div className="text-sm text-red-600">
                          댓글을 불러오지 못했습니다.
                        </div>
                      )}

                      {!isCommentsLoading &&
                        !isCommentsError &&
                        comments.length === 0 && (
                          <div className="text-sm text-gray-500">
                            아직 댓글이 없습니다.
                          </div>
                        )}

                      {!isCommentsLoading &&
                        !isCommentsError &&
                        comments.map(renderComment)}

                      {commentsCount > comments.length && (
                        <div className="text-sm text-gray-500">
                          댓글 {commentsCount.toLocaleString()}개
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 하단: 액션 버튼들 및 댓글 입력 */}
                  <div className="border-t">
                    <div className="flex items-center justify-between p-4 pb-2">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="post"
                          onClick={handleLike}
                          disabled={likeMutation.isPending}
                          className={cn(isLiked && "text-red-500")}
                        >
                          <Heart
                            className={cn("w-6 h-6", isLiked && "fill-current")}
                          />
                        </Button>
                        <Button variant="post">
                          <MessageCircle className="w-6 h-6" />
                        </Button>
                        <Button
                          variant="post"
                          onClick={handleShare}
                          disabled={shareMutation.isPending}
                        >
                          <Send className="w-6 h-6" />
                        </Button>
                      </div>
                      <Button
                        variant="post"
                        onClick={handleBookmark}
                        disabled={bookmarkMutation.isPending}
                      >
                        <Bookmark
                          className={cn("w-6 h-6", isSaved && "fill-current")}
                        />
                      </Button>
                    </div>
                    <div className="px-4 pb-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {likesCount.toLocaleString()} likes
                      </div>
                    </div>
                    <div className="p-4 pt-2 border-t">
                      {renderCommentComposer("p-0")}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="post"
            onClick={handleShare}
            disabled={shareMutation.isPending}
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
        <Button
          variant="post"
          onClick={handleBookmark}
          disabled={bookmarkMutation.isPending}
        >
          <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
        </Button>
      </div>

      <CardContent className="px-4 pt-0 pb-4">
        <div className="mb-2 flex text-sm font-semibold text-gray-900">
          {likesCount.toLocaleString()} likes
        </div>
        <div className="mb-1 flex text-sm leading-5 text-gray-900">
          <span className="mr-1 font-semibold">{username}</span> {post.caption}
        </div>
        <div className="mt-1 flex text-[10px] uppercase text-gray-500">
          {formatTimeAgo(post.createdAt)}
        </div>
      </CardContent>

      <Separator className="mx-4 bg-gray-100" />
      {renderCommentComposer("p-4 pt-3")}
    </Card>
  );
}
