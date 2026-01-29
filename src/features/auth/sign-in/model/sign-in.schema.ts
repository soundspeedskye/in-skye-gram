import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => {
      // 이메일 형식인지 확인
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      return isEmail;
    }, "Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
