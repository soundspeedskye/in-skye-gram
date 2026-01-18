export interface StoryDto {
  id: string;
  username: string;
  userAvatar: string;
  storyImage?: string;
  createdAt: string;
  hasNewStory?: boolean;
}
