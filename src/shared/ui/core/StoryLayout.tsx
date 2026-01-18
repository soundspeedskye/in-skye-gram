import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/lib/avatar";
import { cn } from "@/app/style/utils";

interface StoryLayoutProps {
  username: string;
  userAvatar: string;
  storyImage?: string; // 추가된 필드 활용
  hasNewStory?: boolean;
  isMe?: boolean;
}

export default function StoryLayout({
  username,
  userAvatar,
  storyImage,
  hasNewStory,
  isMe,
}: StoryLayoutProps) {
  return (
    <div className="flex flex-col items-center min-w-[66px] space-y-1.5 cursor-pointer group">
      {/* 테두리 틀 */}
      <div
        className={cn(
          "relative p-[2.5px] rounded-full transition-all duration-300 active:scale-90",
          hasNewStory
            ? "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
            : "bg-gray-200"
        )}
      >
        {/* 프로필 이미지 (기본 노출) */}
        <Avatar className="w-[58px] h-[58px] border-[2.5px] border-white overflow-hidden relative">
          <AvatarImage
            src={userAvatar}
            alt={username}
            className={cn("object-cover transition-opacity duration-300")}
          />

          <AvatarFallback className="bg-gray-100 text-[10px]">
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* 내 스토리 '+' 아이콘 */}
        {isMe && !hasNewStory && (
          <div className="absolute bottom-0 right-0 z-10 flex items-center justify-center w-5 h-5 bg-blue-500 border-2 border-white rounded-full">
            <span className="text-white text-[14px] font-bold leading-none">
              +
            </span>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <span
        className={cn(
          "text-[12px] w-full px-1 text-center overflow-hidden text-ellipsis whitespace-nowrap transition-colors",
          hasNewStory
            ? "text-black font-medium"
            : "text-gray-500 group-hover:text-black"
        )}
      >
        {isMe ? "내 스토리" : username}
      </span>
    </div>
  );
}
