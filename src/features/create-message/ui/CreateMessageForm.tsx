import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Send, Image, Smile } from "lucide-react";
import type { CreateMessageDto } from "@/features/create-message/model/create-message.dto";

interface CreateMessageFormProps {
  recipientId: string;
  onSubmit: (data: CreateMessageDto) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

const CreateMessageForm = ({
  recipientId,
  onSubmit,
  disabled = false,
  placeholder = "Message...",
}: CreateMessageFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const replaceImagePreviewUrl = (file: File | null) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    const nextPreviewUrl = file ? URL.createObjectURL(file) : null;
    imagePreviewUrlRef.current = nextPreviewUrl;
    setImagePreviewUrl(nextPreviewUrl);
  };

  const submitMessage = async () => {
    if ((!content.trim() && !selectedImage) || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const messageData: CreateMessageDto = {
        recipientId,
        content: content.trim(),
        messageType: selectedImage ? "image" : "text",
        ...(selectedImage && { imageFile: selectedImage }),
      };

      await onSubmit(messageData);

      // 성공 시 폼 클리어
      setContent("");
      setSelectedImage(null);
      replaceImagePreviewUrl(null);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitMessage();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      replaceImagePreviewUrl(file);
    }
    e.target.value = "";
  };

  const removeImage = () => {
    setSelectedImage(null);
    replaceImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const canSubmit =
    Boolean(content.trim() || selectedImage) && !isSubmitting && !disabled;

  return (
    <div className="bg-white border-t">
      {/* 이미지 프리뷰 */}
      {selectedImage && (
        <div className="p-3 border-b bg-gray-50">
          <div className="relative inline-block">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="object-cover w-20 h-20 rounded-lg"
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeImage}
              className="absolute w-6 h-6 p-0 text-white bg-gray-800 rounded-full -top-2 -right-2 hover:bg-gray-900"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* 메시지 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4">
        {/* 이미지 선택 버튼 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="h-auto p-2 rounded-full hover:bg-gray-100"
        >
          <Image className="w-6 h-6 text-gray-600" />
        </Button>

        {/* 메시지 입력 */}
        <div className="relative flex-1">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            className="px-4 py-2 pr-12 border-2 border-gray-300 rounded-full resize-none focus:border-gray-400"
            maxLength={1000}
          />
        </div>

        {/* 이모지 버튼 (향후 구현) */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-auto p-2 rounded-full hover:bg-gray-100"
        >
          <Smile className="w-6 h-6 text-gray-600" />
        </Button>

        {/* 전송 버튼 */}
        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-auto p-0 bg-transparent hover:bg-transparent disabled:opacity-50"
        >
          <Send
            className={`w-6 h-6 ${
              canSubmit ? "text-blue-500" : "text-gray-400"
            }`}
          />
        </Button>
      </form>
    </div>
  );
};

export default CreateMessageForm;
