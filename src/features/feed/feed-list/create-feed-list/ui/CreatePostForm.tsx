import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Label } from "@/shared/ui/lib/label";
import { X, Image as ImageIcon, MapPin } from "lucide-react";
import { cn } from "@/app/style/utils";
import type { CreatePostFormData } from "@/features/feed/feed-list/create-feed-list/model/create-post.schema";
import { createPostSchema } from "@/features/feed/feed-list/create-feed-list/model/create-post.schema";

interface Props {
  onSubmit?: (data: CreatePostFormData) => void;
  onClose?: () => void;
  isEmbedded?: boolean;
}

const CreatePostForm = ({ onSubmit, onClose, isEmbedded = false }: Props) => {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);
  const [isLikesHidden, setIsLikesHidden] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
      previewUrlsRef.current = [];
    };
  }, []);

  const clearImagePreviews = () => {
    previewUrlsRef.current.forEach((previewUrl) => {
      URL.revokeObjectURL(previewUrl);
    });
    previewUrlsRef.current = [];
    setImagePreviews([]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setErrors((prev) => ({
        ...prev,
        images: "이미지 파일만 선택할 수 있습니다.",
      }));
      return;
    }

    if (files.length + selectedImages.length > 10) {
      setErrors((prev) => ({ ...prev, images: "Maximum 10 images allowed" }));
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = [...previewUrlsRef.current, ...newPreviews];
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    previewUrlsRef.current = previewUrlsRef.current.filter(
      (previewUrl) => previewUrl !== imagePreviews[index],
    );

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const formData: CreatePostFormData = {
        content,
        imageFiles: selectedImages,
        isCommentsDisabled,
        isLikesHidden,
      };

      const validatedData = createPostSchema.parse(formData);

      if (onSubmit) {
        onSubmit(validatedData);
      } else {
        console.log("Creating post:", validatedData);
      }

      // Reset form
      setContent("");
      setSelectedImages([]);
      clearImagePreviews();
      setLocation("");
      setIsCommentsDisabled(false);
      setIsLikesHidden(false);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const field = err.path[0];
          if (typeof field === "string") {
            formErrors[field] = err.message;
          }
        });
        setErrors(formErrors);
      }
    }
  };

  return (
    <div
      className={cn(
        "bg-white",
        isEmbedded ? "h-full" : "min-h-screen",
        "overflow-y-auto",
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-600"
        >
          <X className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">새 게시물 만들기</h1>
        <Button
          type="submit"
          form="create-post-form"
          size="sm"
          className="text-white bg-blue-500 hover:bg-blue-600"
        >
          공유하기
        </Button>
      </div>

      {/* Form */}
      <form id="create-post-form" onSubmit={handleSubmit} className="p-4">
        {/* Image Upload */}
        <div className="mb-6">
          <Label className="block mb-2 text-sm font-medium">사진</Label>

          {selectedImages.length === 0 ? (
            <div
              className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">
                사진을 여기에 끌어다 놓으세요
              </p>
              <p className="mt-1 text-sm text-gray-500">또는 클릭하여 선택</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-32 rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute w-6 h-6 p-0 transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {selectedImages.length < 10 && (
                <div
                  className="flex items-center justify-center h-32 p-4 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images}</p>
          )}
          {errors.imageFiles && (
            <p className="mt-1 text-sm text-red-500">{errors.imageFiles}</p>
          )}
        </div>

        {/* Caption */}
        <div className="mb-6">
          <Label htmlFor="content" className="block mb-2 text-sm font-medium">
            문구 입력
          </Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문구를 입력하세요..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={2200}
          />
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>{content.length}/2,200</span>
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label
            htmlFor="location"
            className="flex items-center mb-2 text-sm font-medium"
          >
            <MapPin className="w-4 h-4 mr-1" />
            위치 추가
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="위치를 검색하세요"
            className="w-full"
          />
        </div>

        {/* Advanced Options */}
        <div className="pt-4 space-y-4 border-t border-gray-200">
          <Label className="block text-sm font-medium">고급 설정</Label>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">댓글 기능 해제</span>
            <input
              type="checkbox"
              checked={isCommentsDisabled}
              onChange={(e) => setIsCommentsDisabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">좋아요 수 숨기기</span>
            <input
              type="checkbox"
              checked={isLikesHidden}
              onChange={(e) => setIsLikesHidden(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
