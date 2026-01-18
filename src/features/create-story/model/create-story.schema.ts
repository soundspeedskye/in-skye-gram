import { z } from "zod";

export const createStorySchema = z
  .object({
    content: z
      .string()
      .max(500, "스토리 텍스트는 500자를 초과할 수 없습니다.")
      .optional(),

    storyType: z.enum(["image", "video", "text"], {
      message: "스토리 타입을 선택해주세요.",
    }),

    imageFile: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (!file) return true;
        return file.type.startsWith("image/");
      }, "이미지 파일만 업로드 가능합니다.")
      .refine((file) => {
        if (!file) return true;
        return file.size <= 10 * 1024 * 1024; // 10MB
      }, "이미지 파일은 10MB 이하여야 합니다."),

    videoFile: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (!file) return true;
        return file.type.startsWith("video/");
      }, "비디오 파일만 업로드 가능합니다.")
      .refine((file) => {
        if (!file) return true;
        return file.size <= 50 * 1024 * 1024; // 50MB
      }, "비디오 파일은 50MB 이하여야 합니다."),
    duration: z
      .number()
      .min(1, "최소 1초 이상이어야 합니다.")
      .max(60, "최대 60초까지 가능합니다.")
      .optional(),

    allowReplies: z.boolean().default(true),

    allowSharing: z.boolean().default(true),

    mentions: z
      .array(z.string().min(1))
      .max(20, "최대 20명까지 멘션할 수 있습니다.")
      .optional(),
  })
  .refine(
    (data) => {
      // 타입별 필수 필드 검증
      if (
        data.storyType === "text" &&
        (!data.content || data.content.trim().length === 0)
      ) {
        return false;
      }
      if (data.storyType === "image" && !data.imageFile) {
        return false;
      }
      if (data.storyType === "video" && !data.videoFile) {
        return false;
      }
      return true;
    },
    {
      message: "스토리 타입에 따른 필수 내용을 입력해주세요.",
    }
  );

export type CreateStorySchema = z.infer<typeof createStorySchema>;

// 스토리 뷰 스키마
export const storyViewSchema = z.object({
  storyId: z.string().min(1, "스토리 ID가 필요합니다."),
  viewedAt: z.string().datetime("올바른 날짜 형식이 아닙니다."),
});

export type StoryViewSchema = z.infer<typeof storyViewSchema>;
