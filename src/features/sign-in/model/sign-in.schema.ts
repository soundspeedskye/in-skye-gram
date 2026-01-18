import { z } from "zod";

export const signInSchema = z.object({
  id: z
    .string()
    .min(1, "Email or username is required")
    .refine((val) => {
      // 이메일 형식인지 확인
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      // 사용자명 형식인지 확인
      const isUsername =
        /^[a-zA-Z0-9._]+$/.test(val) && val.length >= 3 && val.length <= 30;

      return isEmail || isUsername;
    }, "Please enter a valid email or username"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Legacy type for backward compatibility
export type SignInSchema = SignInFormData;

// Helper functions
export const isEmailFormat = (identifier: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
};

export const isUsernameFormat = (identifier: string): boolean => {
  return (
    /^[a-zA-Z0-9._]+$/.test(identifier) &&
    identifier.length >= 3 &&
    identifier.length <= 30
  );
};

export const formatIdentifierType = (
  identifier: string
): "email" | "username" => {
  return isEmailFormat(identifier) ? "email" : "username";
};
