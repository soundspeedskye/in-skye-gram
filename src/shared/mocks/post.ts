import type { PostDto } from "@/entities/post/model/post.dto";

export const postsData: PostDto[] = [
  {
    id: "1",
    username: "photographer",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=470&h=470&fit=crop",
    content: "Beautiful sunset at the beach 🌅 #photography #sunset #nature",
    likes: 1234,
    createdAt: "2024-05-20T10:00:00Z", // 약 2시간 전 (현재 시간 기준 가공용)
    isVerified: true,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: "c1",
        username: "traveler",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        content: "Wow, amazing shot!",
        createdAt: "2024-05-20T11:00:00Z",
      },
      {
        id: "c2",
        username: "photographer_pro",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        content: "The colors are incredible! 📸",
        createdAt: "2024-05-20T12:00:00Z",
      },
    ],
  },
  {
    id: "2",
    username: "friend1",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b0e5?w=150&h=150&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=470&h=470&fit=crop",
    content: "Delicious breakfast to start the day right! 🥞☕️",
    likes: 567,
    createdAt: "2024-05-20T08:00:00Z", // 약 4시간 전
    isVerified: false,
    isLiked: true,
    isSaved: true,
    comments: [
      {
        id: "c3",
        username: "foodie_lover",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        content: "Looks delicious! Recipe please? 🤤",
        createdAt: "2024-05-20T09:00:00Z",
      },
    ],
  },
  {
    id: "3",
    username: "artist",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=470&h=470&fit=crop",
    content: "Working on my latest painting. Art is life! 🎨✨",
    likes: 892,
    createdAt: "2024-05-20T06:00:00Z", // 약 6시간 전
    isVerified: true,
    isLiked: false,
    isSaved: false,
    comments: [],
  },
  {
    id: "4",
    username: "friend2",
    userAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=470&h=470&fit=crop",
    content: "Shopping day with the squad! 🛍️👯‍♀️ #shopping #friends",
    likes: 345,
    createdAt: "2024-05-20T04:00:00Z", // 약 8시간 전
    isVerified: false,
    isLiked: false,
    isSaved: false,
    comments: [],
  },
];
