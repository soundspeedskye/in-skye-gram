import { type FormEvent, useState } from "react";
import type { UserProfilesDto } from "@/entities/user-profiles/model/user-profiles.dto";
import type { UpdateUserProfileDto } from "../model/update-user-profiles.dto";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Label } from "@/shared/ui/lib/label";

interface UpdateUserProfilesFormProps {
  initialProfile: UserProfilesDto;
  isLoading?: boolean;
  apiError?: Error | null;
  onCancel: () => void;
  onSubmit: (data: UpdateUserProfileDto) => void;
}

export default function UpdateUserProfilesForm({
  initialProfile,
  isLoading = false,
  apiError = null,
  onCancel,
  onSubmit,
}: UpdateUserProfilesFormProps) {
  const [nickname, setNickname] = useState(initialProfile.nickname ?? "");
  const [description, setDescription] = useState(
    initialProfile.description ?? "",
  );
  const [profileImageUrl, setProfileImageUrl] = useState(
    initialProfile.profile_image_url ?? "",
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      nickname: nickname.trim() || null,
      description: description.trim() || null,
      profile_image_url: profileImageUrl.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profile-nickname">닉네임</Label>
        <Input
          id="profile-nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          disabled={isLoading}
          placeholder="닉네임"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-image-url">프로필 이미지 URL</Label>
        <Input
          id="profile-image-url"
          value={profileImageUrl}
          onChange={(event) => setProfileImageUrl(event.target.value)}
          disabled={isLoading}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-description">소개</Label>
        <textarea
          id="profile-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isLoading}
          maxLength={150}
          placeholder="소개를 입력하세요"
          className="min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="text-right text-xs text-gray-500">
          {description.length}/150
        </div>
      </div>

      {apiError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {apiError.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
