export interface SignUpDto {
  email: string;
  password: string;
  fullName: string;
  username: string;
  confirmPassword: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface SignUpResponseDto {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatar?: string;
    isVerified: boolean;
  };
  token?: string;
}

export interface SignUpErrorDto {
  field: string;
  message: string;
}
