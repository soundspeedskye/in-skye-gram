import { z } from "zod";

export const createMessageSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),

  content: z
    .string()
    .min(1, "Message content is required")
    .max(1000, "Message is too long. Maximum 1,000 characters allowed."),

  messageType: z.enum(["text", "image", "story_reply"]),

  replyToMessageId: z.string().optional(),

  imageFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.type.startsWith("image/") && file.size <= 8 * 1024 * 1024;
    }, "Image must be under 8MB"),
  storyId: z.string().optional(),
});

export type CreateMessageFormData = z.infer<typeof createMessageSchema>;

// Message validation functions
export const validateMessageContent = (
  content: string
): { isValid: boolean; error?: string } => {
  if (!content.trim()) {
    return { isValid: false, error: "Message cannot be empty" };
  }

  if (content.length > 1000) {
    return { isValid: false, error: "Message is too long" };
  }

  return { isValid: true };
};

export const validateImageMessage = (
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

// Message formatting helpers
export const formatMessageTime = (timestamp: string): string => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - messageTime.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;

  return messageTime.toLocaleDateString();
};

export const detectMentions = (content: string): string[] => {
  const mentionRegex = /@([a-zA-Z0-9._]+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map((mention) => mention.slice(1)) : [];
};
