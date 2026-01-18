export interface SearchResultUser {
  type: "user";
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  verified: boolean;
  followers: string;
}

export interface SearchResultHashtag {
  type: "hashtag";
  id: string;
  name: string;
  postCount: string;
}

export interface SearchResultLocation {
  type: "location";
  id: string;
  name: string;
  locationType: string;
}

export type SearchResult =
  | SearchResultUser
  | SearchResultHashtag
  | SearchResultLocation;

export const mockSearchResults: SearchResult[] = [
  {
    type: "user",
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: false,
    followers: "1.2M followers",
  },
  {
    type: "user",
    id: "2",
    username: "janesmith",
    fullName: "Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    verified: true,
    followers: "856K followers",
  },
  {
    type: "hashtag",
    id: "3",
    name: "#photography",
    postCount: "2.4M posts",
  },
  {
    type: "hashtag",
    id: "4",
    name: "#travel",
    postCount: "1.8M posts",
  },
  {
    type: "location",
    id: "5",
    name: "Seoul, South Korea",
    locationType: "City",
  },
  {
    type: "user",
    id: "6",
    username: "davidkim",
    fullName: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: false,
    followers: "342K followers",
  },
  {
    type: "hashtag",
    id: "7",
    name: "#foodie",
    postCount: "3.1M posts",
  },
  {
    type: "location",
    id: "8",
    name: "Tokyo, Japan",
    locationType: "City",
  },
];
