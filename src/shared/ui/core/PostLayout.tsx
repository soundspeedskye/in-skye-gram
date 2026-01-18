import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@shared/ui/lib/card";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/lib/avatar";
import { Button } from "@shared/ui/lib/button";
import { Separator } from "@shared/ui/lib/separator";
import { cn } from "@/app/style/utils";

interface Props {
  username: string;
  userAvatar: string;
  postImage: string;
  content: string;
  likes: number;
  // comments: string[];
  timeAgo: string;
  isVerified?: boolean;
}

export default function PostLayout({
  username,
  userAvatar,
  postImage,
  content,
  likes,
  // comments,
  timeAgo,
  isVerified = false,
}: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  // const handleSave = () => {
  //   setIsSaved(!isSaved);
  // };

  return (
    <Card className="max-w-[470px] mx-auto mb-6 border border-gray-200 rounded-lg shadow-none bg-white">
      {/* 카드 상단 작성자 정보 */}
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
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Post Image */}
      <div className="mt-3">
        <img
          src={postImage}
          alt="Instagram post"
          className="object-cover w-full aspect-square"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-4">
          {/* 좋아요 버튼 */}
          <Button
            variant="post"
            onClick={handleLike}
            className={cn(isLiked ? "text-red-500" : "text-gray-900")}
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
          </Button>

          {/* 댓글 버튼 */}
          <Button variant="post">
            <MessageCircle className="w-6 h-6" />
          </Button>

          {/* 공유 버튼 */}
          <Button variant="post">
            <Send className="w-6 h-6" />
          </Button>
        </div>

        {/* 저장 버튼 */}
        <Button variant="post" onClick={() => setIsSaved(!isSaved)}>
          <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
        </Button>
      </div>

      {/* Likes count and content */}
      <CardContent className="px-4 pt-0 pb-4">
        <div className="mb-2 text-sm font-semibold text-gray-900">
          {likesCount.toLocaleString()} likes
        </div>

        <div className="mb-1 text-sm leading-5 text-gray-900">
          <span className="font-semibold">{username}</span> {content}
        </div>

        <div className="text-xs text-gray-500 uppercase">{timeAgo}</div>
      </CardContent>

      <Separator className="mx-4 bg-gray-200" />

      {/* Comment section */}
      <div className="p-4 pt-3">
        <div className="text-sm text-gray-500">Add a comment...</div>
      </div>
    </Card>
  );
}
