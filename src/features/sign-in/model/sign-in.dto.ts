export interface SignInDto {
  id: string;
  password: string;
}

export interface SignInResponseDto {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatar?: string;
    isVerified: boolean;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
  token?: string;
  refreshToken?: string;
}

export interface SignInErrorDto {
  field?: string;
  message: string;
  code?: string;
}
