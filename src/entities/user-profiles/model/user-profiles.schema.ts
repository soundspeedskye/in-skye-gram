import { z } from "zod";

export const profileSchema = z.object({
  user_id: z.string().min(1, "ID는 필수입니다."),
  nickname: z
    .string()
    .min(3, "닉네임은 3자 이상이어야 합니다.")
    .max(30, "닉네임은 30자를 초과할 수 없습니다.")
    .regex(/^[a-zA-Z0-9_.]+$/, "닉네임은 영문, 숫자, _, . 만 사용 가능합니다."),
  description: z
    .string()
    .max(150, "소개는 150자를 초과할 수 없습니다.")
    .optional()
    .default(""),
  profile_image_url: z.string().url("올바른 이미지 URL을 입력해주세요."),

  follower_count: z.number().min(0, "팔로워 수는 0 이상이어야 합니다."),
  following_count: z.number().min(0, "팔로잉 수는 0 이상이어야 합니다."),
  post_count: z.number().min(0, "게시물 수는 0 이상이어야 합니다."),

  created_at: z.string().optional(),
});

export const updateProfileSchema = z.object({
  description: z
    .string()
    .max(150, "소개는 150자를 초과할 수 없습니다.")
    .optional(),
  profile_image_url: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.type.startsWith("image/");
    }, "이미지 파일만 업로드 가능합니다.")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024; // 5MB
    }, "이미지 파일은 5MB 이하여야 합니다."),
});

export const followSchema = z
  .object({
    userId: z.string().min(1, "사용자 ID는 필수입니다."),
    targetUserId: z.string().min(1, "대상 사용자 ID는 필수입니다."),
    action: z.enum(["follow", "unfollow"], {
      message: "올바른 액션을 선택해주세요.",
    }),
  })
  .refine((data) => data.userId !== data.targetUserId, {
    message: "자기 자신을 팔로우/언팔로우할 수 없습니다.",
  });

export const blockSchema = z
  .object({
    userId: z.string().min(1, "사용자 ID는 필수입니다."),
    targetUserId: z.string().min(1, "대상 사용자 ID는 필수입니다."),
    action: z.enum(["block", "unblock"], {
      message: "올바른 액션을 선택해주세요.",
    }),
  })
  .refine((data) => data.userId !== data.targetUserId, {
    message: "자기 자신을 차단/차단해제할 수 없습니다.",
  });

export type ProfileSchema = z.infer<typeof profileSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type FollowSchema = z.infer<typeof followSchema>;
export type BlockSchema = z.infer<typeof blockSchema>;
