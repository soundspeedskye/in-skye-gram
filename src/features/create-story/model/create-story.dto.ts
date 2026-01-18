export interface CreateStoryDto {
  content?: string; // 텍스트 스토리용
  imageFile?: File; // 이미지 스토리용
  videoFile?: File; // 비디오 스토리용
  storyType: "image" | "video" | "text";
  duration?: number; // 스토리 지속 시간 (초)
  allowReplies: boolean;
  allowSharing: boolean;
  mentions?: string[]; // 멘션된 사용자 ID들
}

export interface CreateStoryResponse {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  storyType: "image" | "video" | "text";
  content?: string;
  mediaUrl?: string; // 이미지/비디오 URL
  createdAt: string;
  expiresAt: string; // 24시간 후
  viewsCount: number;
  allowReplies: boolean;
  allowSharing: boolean;
  mentions?: string[];
}

// 스토리 뷰어용 DTO
export interface StoryViewDto {
  storyId: string;
  viewedAt: string;
}
