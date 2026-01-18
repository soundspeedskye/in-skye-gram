import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/shared/ui/lib/dialog";

import { cn } from "@/app/style/utils";
import type { StoryDto } from "@/entities/story/model/story.dto";
import StoryLayout from "@/shared/ui/core/StoryLayout";
import { XIcon } from "lucide-react";

interface StoryItemCardProps {
  story: StoryDto;
}

export default function StoryItemCard({ story }: StoryItemCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex-shrink-0">
          <StoryLayout
            username={story.username}
            userAvatar={story.userAvatar}
            storyImage={story.storyImage}
            hasNewStory={story.hasNewStory}
            isMe={story.username === "your_story"}
          />
        </div>
      </DialogTrigger>

      {/* 전체 화면 스타일 적용 */}
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-none w-screen h-screen m-0 p-0 border-none bg-black/95",
          "flex flex-col items-center justify-center",
          "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        )}
      >
        {/* 스크린 리더용 타이틀 */}
        <DialogTitle className="sr-only">{story.username}의 스토리</DialogTitle>

        {/* 상단 컨트롤 바 (유저 정보 + 닫기 버튼) */}
        <div className="absolute top-0 left-0 z-50 flex items-center justify-between w-full p-6 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-3">
            <img
              src={story.userAvatar}
              className="object-cover w-10 h-10 border-2 rounded-full border-white/80"
              alt={story.username}
            />
            <div className="flex flex-col">
              <span className="text-white text-[15px] font-bold">
                {story.username}
              </span>
              <span className="text-white/60 text-[13px]">
                {story.createdAt}
              </span>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <DialogClose asChild>
            <button className="text-white bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0">
              <XIcon className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        {/* 중앙 스토리 이미지 컨테이너 */}
        <div className="relative w-full max-w-[500px] aspect-[9/16] md:max-h-[90vh] flex items-center justify-center overflow-hidden shadow-2xl">
          {story.storyImage ? (
            <img
              src={story.storyImage}
              alt="Story Content"
              className="object-cover w-full h-full sm:rounded-lg" // 모바일은 꽉 차게, 데스크탑은 살짝 라운드
            />
          ) : (
            <div className="text-lg text-white">
              이미지를 불러올 수 없습니다.
            </div>
          )}
        </div>

        {/* 하단 반응형 배경 처리 (배경 클릭 시 닫기) */}
        <DialogClose asChild>
          <div className="absolute inset-0 bg-black -z-10" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
