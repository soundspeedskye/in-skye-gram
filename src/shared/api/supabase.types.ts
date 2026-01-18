export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: number;
          user_id: string;
          image_url: string;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          image_url: string;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          image_url?: string;
          content?: string | null;
          created_at?: string;
        };
      };
      // 필요한 경우 comments, likes 등도 같은 방식으로 추가
    };
  };
}
