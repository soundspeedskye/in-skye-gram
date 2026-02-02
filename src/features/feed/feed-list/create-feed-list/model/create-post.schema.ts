import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .max(2200, "Caption is too long. Maximum 2,200 characters allowed."),

  imageFiles: z
    .array(z.instanceof(File))
    .min(1, "Please select at least one image")
    .max(10, "Maximum 10 images allowed")
    .refine((files) => {
      return files.every(
        (file) => file.type.startsWith("image/") && file.size <= 8 * 1024 * 1024 // 8MB per image
      );
    }, "All files must be images under 8MB"),

  taggedUsers: z
    .array(z.string())
    .max(20, "Maximum 20 people can be tagged")
    .optional(),

  isCommentsDisabled: z.boolean().optional(),
  isLikesHidden: z.boolean().optional(),

  altText: z
    .array(z.string().max(125, "Alt text must be 125 characters or less"))
    .optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

// Image validation functions
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "File must be an image" };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { isValid: false, error: "Image must be less than 8MB" };
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  return { isValid: true };
};

export const validateImageDimensions = (
  file: File
): Promise<{
  isValid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;
      const aspectRatio = width / height;

      // Instagram aspect ratio constraints
      if (aspectRatio < 0.8 || aspectRatio > 1.91) {
        resolve({
          isValid: false,
          error: "Image aspect ratio must be between 0.8:1 and 1.91:1",
          dimensions: { width, height },
        });
      } else {
        resolve({
          isValid: true,
          dimensions: { width, height },
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: "Unable to load image",
      });
    };

    img.src = url;
  });
};

export const generateHashtags = (content: string): string[] => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches.map((tag) => tag.slice(1)) : [];
};

export const generateMentions = (content: string): string[] => {
  const mentionRegex = /@[a-zA-Z0-9._]+/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map((mention) => mention.slice(1)) : [];
};
