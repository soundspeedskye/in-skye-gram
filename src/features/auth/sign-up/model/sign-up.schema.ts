import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      return isEmail;
    }, "이메일 주소 형식을 확인해주세요."),

  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
