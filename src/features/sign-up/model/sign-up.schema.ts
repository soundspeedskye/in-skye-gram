import { z } from "zod";

export const signUpSchema = z
  .object({
    id: z
      .string()
      .min(1, "Email or phone number is required")
      .refine((val) => {
        // 이메일 형식인지 확인
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        // 핸드폰 번호 형식인지 확인 (한국 및 국제 형식)
        const isPhoneNumber =
          /^(\+?[1-9]\d{1,14}|0\d{1,2}-?\d{3,4}-?\d{4})$/.test(
            val.replace(/\s|-/g, "")
          );

        return isEmail || isPhoneNumber;
      }, "Please enter a valid email address or phone number"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters"),

    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, periods, and underscores"
      )
      .refine((val) => !val.startsWith(".") && !val.endsWith("."), {
        message: "Username cannot start or end with a period",
      })
      .refine((val) => !/\.\./.test(val), {
        message: "Username cannot contain consecutive periods",
      }),

    // phoneNumber와 dateOfBirth는 optional로 유지하되, 별도 필드로 관리
    phoneNumber: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        return /^\+?[\d\s-()]+$/.test(val);
      }, "Please enter a valid phone number"),

    dateOfBirth: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return age >= 13;
      }, "You must be at least 13 years old to join"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{1,2}-?\d{3,4}-?\d{4})$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ""));
};

export const validateId = (id: string): boolean => {
  return validateEmail(id) || validatePhoneNumber(id);
};

export const getIdType = (id: string): "email" | "phone" | "invalid" => {
  if (validateEmail(id)) return "email";
  if (validatePhoneNumber(id)) return "phone";
  return "invalid";
};

export const validateUsername = (username: string): boolean => {
  if (username.length < 3 || username.length > 30) return false;
  if (!/^[a-zA-Z0-9._]+$/.test(username)) return false;
  if (username.startsWith(".") || username.endsWith(".")) return false;
  if (/\.\./.test(username)) return false;
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 6) return false;
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return false;
  return true;
};

export const getPasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score < 2) return { score, label: "Weak", color: "red" };
  if (score < 4) return { score, label: "Fair", color: "orange" };
  if (score < 6) return { score, label: "Good", color: "yellow" };
  return { score, label: "Strong", color: "green" };
};
