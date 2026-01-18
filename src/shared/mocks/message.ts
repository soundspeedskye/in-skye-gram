export interface Chat {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export const mockChats: Chat[] = [
  {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    username: "janesmith",
    fullName: "Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Thanks for sharing that post!",
    timestamp: "1h",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "3",
    username: "mikebrown",
    fullName: "Mike Brown",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Let's meet up sometime",
    timestamp: "3h",
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: "4",
    username: "sarahwilson",
    fullName: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Great photo! 📸",
    timestamp: "1d",
    isOnline: false,
    unreadCount: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "2",
    content: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: "2",
    senderId: "1",
    content: "I'm doing great! Just working on some projects. How about you?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: "3",
    senderId: "2",
    content: "That's awesome! I'd love to hear more about them",
    timestamp: "10:35 AM",
    isOwn: false,
  },
  {
    id: "4",
    senderId: "1",
    content:
      "Sure! I'm working on a new Instagram clone using React and TypeScript. It's been really fun to build!",
    timestamp: "10:38 AM",
    isOwn: true,
  },
  {
    id: "5",
    senderId: "2",
    content: "Wow, that sounds really cool! 🔥",
    timestamp: "10:40 AM",
    isOwn: false,
  },
];
