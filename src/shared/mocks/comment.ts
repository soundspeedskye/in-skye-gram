export interface Comment {
  id: string;
  postId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    username: "john_doe",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    content: "Amazing photo! 🔥",
    createdAt: "2024-01-15T10:30:00Z",
    likesCount: 12,
    isLiked: false,
  },
  {
    id: "comment-2",
    postId: "post-1",
    username: "jane_smith",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    content: "Love this! Where was this taken?",
    createdAt: "2024-01-15T11:45:00Z",
    likesCount: 8,
    isLiked: true,
  },
  {
    id: "comment-3",
    postId: "post-2",
    username: "mike_wilson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    content: "Great composition! 📸",
    createdAt: "2024-01-15T09:20:00Z",
    likesCount: 5,
    isLiked: false,
  },
  {
    id: "comment-4",
    postId: "post-2",
    username: "sarah_jones",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    content: "This is so inspiring! 💫",
    createdAt: "2024-01-15T12:10:00Z",
    likesCount: 15,
    isLiked: true,
  },
  {
    id: "comment-5",
    postId: "post-3",
    username: "alex_brown",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    content: "Can't wait to visit here someday! 🌟",
    createdAt: "2024-01-15T08:55:00Z",
    likesCount: 3,
    isLiked: false,
  },
];
