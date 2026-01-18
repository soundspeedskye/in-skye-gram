import type { StoryDto } from "@/entities/story/model/story.dto";

export const storiesData: StoryDto[] = [
  {
    id: "1",
    username: "your_story",
    userAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    storyImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    createdAt: "2024-05-20T10:00:00Z",
    hasNewStory: false,
  },
  {
    id: "2",
    username: "traveler_jane",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b0e5?w=150&h=150&fit=crop&crop=face",
    storyImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    createdAt: "2024-05-20T14:30:00Z",
    hasNewStory: true,
  },
  {
    id: "3",
    username: "foodie_king",
    userAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    storyImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    createdAt: "2024-05-20T15:45:00Z",
    hasNewStory: true,
  },
  {
    id: "4",
    username: "nature_lover",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    storyImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    createdAt: "2024-05-19T23:20:00Z",
    hasNewStory: true,
  },
  {
    id: "5",
    username: "design_studio",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    storyImage:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800",
    createdAt: "2024-05-19T09:00:00Z",
    hasNewStory: false,
  },
  {
    id: "6",
    username: "tech_guru",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    storyImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    createdAt: "2024-05-20T02:15:00Z",
    hasNewStory: true,
  },
];
