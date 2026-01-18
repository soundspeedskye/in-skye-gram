export interface Profile {
  id: string;
  username: string;
  fullName: string;
  description: string;
  avatar: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  website?: string;
}

export const mockProfile: Profile = {
  id: "current_user",
  username: "your_username",
  fullName: "Your Full Name",
  description:
    "📸 Photography enthusiast | 🌍 Travel lover | ✨ Living my best life",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  isVerified: false,
  isPrivate: false,
  followersCount: 1234,
  followingCount: 567,
  postsCount: 89,
  website: "https://your-website.com",
};

export const mockSuggestedProfiles: Profile[] = [
  {
    id: "suggested_1",
    username: "photographer_pro",
    fullName: "Professional Photographer",
    description: "📷 Professional photographer | 🏆 Award winner",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    isPrivate: false,
    followersCount: 45600,
    followingCount: 1200,
    postsCount: 890,
  },
  {
    id: "suggested_2",
    username: "travel_addict",
    fullName: "World Explorer",
    description: "✈️ Exploring the world one city at a time",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    isPrivate: false,
    followersCount: 12300,
    followingCount: 800,
    postsCount: 456,
  },
  {
    id: "suggested_3",
    username: "foodie_life",
    fullName: "Food Lover",
    description: "🍔 Food blogger | 🍰 Recipe creator",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    isPrivate: false,
    followersCount: 8900,
    followingCount: 345,
    postsCount: 234,
  },
];
