import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/lib/button";
import { Camera, Video, Type, X, Upload } from "lucide-react";
import type { CreateStoryDto } from "@/features/create-story/model/create-story.dto";

interface CreateStoryFormProps {
  onSubmit: (data: CreateStoryDto) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const CreateStoryForm = ({
  onSubmit,
  onCancel,
  disabled = false,
}: CreateStoryFormProps) => {
  const [storyType, setStoryType] = useState<"image" | "video" | "text">(
    "image"
  );
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [allowReplies, setAllowReplies] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const replacePreviewUrl = (file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreviewUrl = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // 타입별 유효성 검사
    if (storyType === "text" && !content.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }
    if (storyType === "image" && !selectedFile) {
      alert("이미지를 선택해주세요.");
      return;
    }
    if (storyType === "video" && !selectedFile) {
      alert("비디오를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const storyData: CreateStoryDto = {
        storyType,
        allowReplies,
        allowSharing,
        ...(storyType === "text" && {
          content: content.trim(),
        }),
        ...(storyType === "image" && { imageFile: selectedFile! }),
        ...(storyType === "video" && { videoFile: selectedFile! }),
      };

      await onSubmit(storyData);
    } catch (error) {
      console.error("스토리 생성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType =
        storyType === "image"
          ? file.type.startsWith("image/")
          : file.type.startsWith("video/");

      if (isValidType) {
        setSelectedFile(file);
        replacePreviewUrl(file);
      } else {
        alert(
          `${
            storyType === "image" ? "이미지" : "비디오"
          } 파일만 선택 가능합니다.`
        );
      }
    }
    e.target.value = "";
  };

  const removeFile = () => {
    setSelectedFile(null);
    replacePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleStoryTypeChange = (nextStoryType: "image" | "video" | "text") => {
    if (nextStoryType === storyType) return;
    setStoryType(nextStoryType);
    removeFile();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">새 스토리</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 스토리 타입 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              스토리 타입
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={storyType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStoryTypeChange("image")}
                className="flex-1 gap-2"
              >
                <Camera className="w-4 h-4" />
                사진
              </Button>
              <Button
                type="button"
                variant={storyType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStoryTypeChange("video")}
                className="flex-1 gap-2"
              >
                <Video className="w-4 h-4" />
                동영상
              </Button>
              <Button
                type="button"
                variant={storyType === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStoryTypeChange("text")}
                className="flex-1 gap-2"
              >
                <Type className="w-4 h-4" />
                텍스트
              </Button>
            </div>
          </div>

          {/* 텍스트 스토리 */}
          {storyType === "text" && (
            <div className="space-y-4">
              <div className="relative aspect-[9/16] rounded-lg flex items-center justify-center text-center p-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="스토리를 입력하세요..."
                  className="w-full text-center bg-transparent outline-none resize-none placeholder:opacity-50"
                  maxLength={500}
                />
              </div>
            </div>
          )}

          {/* 이미지/비디오 스토리 */}
          {(storyType === "image" || storyType === "video") && (
            <div className="space-y-4">
              <input
                ref={storyType === "image" ? fileInputRef : videoInputRef}
                type="file"
                accept={storyType === "image" ? "image/*" : "video/*"}
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile && previewUrl ? (
                <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-100">
                  {storyType === "image" ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      className="object-cover w-full h-full"
                      controls
                    />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="absolute w-8 h-8 text-white bg-black bg-opacity-50 rounded-full top-2 right-2 hover:bg-opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (storyType === "image") {
                      fileInputRef.current?.click();
                    } else {
                      videoInputRef.current?.click();
                    }
                  }}
                  className="w-full aspect-[9/16] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500">
                    {storyType === "image" ? "사진 선택" : "동영상 선택"}
                  </span>
                </Button>
              )}
            </div>
          )}

          {/* 설정 옵션 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">답글 허용</span>
              <input
                type="checkbox"
                checked={allowReplies}
                onChange={(e) => setAllowReplies(e.target.checked)}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">공유 허용</span>
              <input
                type="checkbox"
                checked={allowSharing}
                onChange={(e) => setAllowSharing(e.target.checked)}
                className="rounded"
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || disabled}
              className="flex-1"
            >
              {isSubmitting ? "업로드 중..." : "스토리 만들기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryForm;
