export interface CreateMessageDto {
  recipientId: string;
  content: string;
  messageType: "text" | "image" | "story_reply";
  replyToMessageId?: string;
  imageFile?: File;
  storyId?: string;
}

export interface CreateMessageResponseDto {
  success: boolean;
  message: string;
  messageData?: {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    messageType: "text" | "image" | "story_reply";
    createdAt: string;
    isRead: boolean;
    replyToMessageId?: string;
    mediaUrl?: string;
    storyId?: string;
  };
}

export interface MessageThreadDto {
  id: string;
  participants: string[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    messageType: "text" | "image" | "story_reply";
  };
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
}
