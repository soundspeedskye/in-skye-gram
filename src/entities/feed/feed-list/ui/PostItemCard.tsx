import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/ui/lib/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/lib/avatar";
import { Button } from "@/shared/ui/lib/button";
import { Separator } from "@/shared/ui/lib/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/shared/ui/lib/dialog";
import { cn } from "@/app/style/utils";
import type { PostDto } from "@/entities/feed/feed-list/model/feed.dto";
import { formatTimeAgo } from "@/shared/ui/lib/functions/date";

interface PostItemCardProps extends PostDto {}

export default function PostItemCard({
  username,
  userAvatar,
  postImage,
  content,
  likes,
  comments,
  createdAt,
  isVerified = false,
}: PostItemCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
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
              {isVerified && (
                <div className="flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full">
                  <span className="text-[10px] text-white">✓</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
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
            className={cn(isLiked && "text-red-500")}
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
          </Button>

          {/* Comment Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="post">
                <MessageCircle className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white p-0 overflow-hidden w-[95vw] h-[85vh] max-w-5xl md:max-w-[1100px]">
              <DialogTitle className="sr-only">Post Details</DialogTitle>
              <div className="flex w-full h-full">
                {/* 왼쪽: 이미지 */}
                <div className="relative flex items-center justify-center flex-1 min-w-0 overflow-hidden bg-black">
                  <img
                    src={postImage}
                    alt="post content"
                    className="block object-contain w-full h-full"
                  />
                </div>

                {/* 오른쪽: 게시글 정보 및 댓글 */}
                <div className="w-[400px] flex flex-col bg-white border-l">
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
                        {isVerified && (
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
                            {content}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {formatTimeAgo(createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 댓글들 */}
                    <div className="space-y-4">
                      {comments &&
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-3"
                          >
                            <Avatar className="w-8 h-8 mt-1">
                              <AvatarImage
                                src={comment.userAvatar}
                                alt={comment.username}
                              />
                              <AvatarFallback>
                                {comment.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="mr-1 font-semibold">
                                  {comment.username}
                                </span>
                                {comment.content}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {formatTimeAgo(comment.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 하단: 액션 버튼들 및 댓글 입력 */}
                  <div className="border-t">
                    <div className="flex items-center justify-between p-4 pb-2">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="post"
                          onClick={handleLike}
                          className={cn(isLiked && "text-red-500")}
                        >
                          <Heart
                            className={cn("w-6 h-6", isLiked && "fill-current")}
                          />
                        </Button>
                        <Button variant="post">
                          <MessageCircle className="w-6 h-6" />
                        </Button>
                        <Button variant="post">
                          <Send className="w-6 h-6" />
                        </Button>
                      </div>
                      <Button
                        variant="post"
                        onClick={() => setIsSaved(!isSaved)}
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
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full text-sm outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="post">
            <Send className="w-6 h-6" />
          </Button>
        </div>
        <Button variant="post" onClick={() => setIsSaved(!isSaved)}>
          <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
        </Button>
      </div>

      <CardContent className="px-4 pt-0 pb-4">
        <div className="flex mb-2 text-sm font-semibold text-gray-900 flex-start">
          {likesCount.toLocaleString()} likes
        </div>
        <div className="flex mb-1 text-sm leading-5 text-gray-900 flex-start">
          <span className="mr-1 font-semibold">{username}</span> {content}
        </div>
        <div className="text-[10px] text-gray-500 uppercase mt-1 flex flex-start">
          {formatTimeAgo(createdAt)}
        </div>
      </CardContent>

      <Separator className="mx-4 bg-gray-100" />
      <div className="flex p-4 pt-3 text-sm text-gray-500 cursor-text flex-start">
        Add a comment...
      </div>
    </Card>
  );
}
