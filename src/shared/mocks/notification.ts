export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  username: string;
  userAvatar: string;
  isVerified: boolean;
  message: string;
  timestamp: string;
  isRead: boolean;
  isFollowing?: boolean;
  postImage?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    username: "photographer_pro",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    message: "liked your photo.",
    timestamp: "2026-01-11T10:30:00Z",
    isRead: false,
    isFollowing: true,
    postImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop",
  },
  {
    id: "2",
    type: "comment",
    username: "travel_addict",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    message: 'commented: "Amazing shot! 📸"',
    timestamp: "2026-01-11T09:15:00Z",
    isRead: false,
    isFollowing: true,
    postImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop",
  },
  {
    id: "3",
    type: "follow",
    username: "foodie_life",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    message: "started following you.",
    timestamp: "2026-01-11T08:45:00Z",
    isRead: true,
    isFollowing: false,
  },
  {
    id: "4",
    type: "like",
    username: "artist_studio",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    message: "liked your photo.",
    timestamp: "2026-01-11T07:20:00Z",
    isRead: true,
    isFollowing: true,
    postImage:
      "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=80&h=80&fit=crop",
  },
  {
    id: "5",
    type: "mention",
    username: "fashion_blogger",
    userAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    message: "mentioned you in a comment.",
    timestamp: "2026-01-11T06:10:00Z",
    isRead: true,
    isFollowing: false,
  },
  {
    id: "6",
    type: "comment",
    username: "nature_lover",
    userAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    message: 'commented: "Love this composition! 🌿"',
    timestamp: "2026-01-11T05:30:00Z",
    isRead: true,
    isFollowing: true,
    postImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop",
  },
  {
    id: "7",
    type: "like",
    username: "street_photographer",
    userAvatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    message: "and 12 others liked your photo.",
    timestamp: "2026-01-10T22:15:00Z",
    isRead: true,
    isFollowing: true,
    postImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop",
  },
];
