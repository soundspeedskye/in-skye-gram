import { useState } from "react";
import { Button } from "@/shared/ui/lib/button";
import type { CreateCommentDto } from "@/features/create-comment/model/create-comment.dto";

interface CreateCommentFormProps {
  postId: string;
  onSubmit: (data: CreateCommentDto) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

const CreateCommentForm = ({
  postId,
  onSubmit,
  placeholder = "Add a comment...",
  disabled = false,
}: CreateCommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitComment = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        postId,
        content: comment.trim(),
      });

      // 성공 시 입력 필드 클리어
      setComment("");
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitComment();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitComment();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 pt-2 border-t">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        className="flex-1 text-sm outline-none placeholder:text-gray-500 disabled:opacity-50"
        maxLength={2200}
      />
      {comment.trim() && (
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={isSubmitting || disabled}
          className="h-auto p-0 text-sm font-semibold text-blue-500 hover:text-blue-600 hover:bg-transparent disabled:opacity-50"
        >
          {isSubmitting ? "등록 중..." : "게시"}
        </Button>
      )}
    </form>
  );
};

export default CreateCommentForm;
