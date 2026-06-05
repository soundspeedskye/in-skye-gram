import { supabase } from "@/shared/api/supabase";
import { callEdgeFunction } from "@/shared/api/fetchAPI";
import type { Camelize, Tables } from "@/shared/api/types";

export type FeedImageSource =
  | File
  | {
      uri: string;
      name?: string;
      type?: string;
    };

export interface CreateFeedParams {
  caption?: string;
  images?: FeedImageSource[];
}

export type Feed = Camelize<Tables<"feeds">>;

export type CreateFeedResult = Pick<Feed, "id" | "images"> & Partial<Feed>;

export const createFeed = async (
  params: CreateFeedParams,
): Promise<CreateFeedResult> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const formData = new FormData();

  if (params.caption) {
    formData.append("caption", params.caption);
  }

  if (params.images) {
    for (const image of params.images) {
      if (image instanceof File) {
        formData.append("images", image);
      } else {
        formData.append("images", {
          uri: image.uri,
          name: image.name ?? "image.jpg",
          type: image.type ?? "image/jpeg",
        } as unknown as Blob);
      }
    }
  }

  return callEdgeFunction<CreateFeedResult>(
    "/functions/v1/create-feed",
    formData,
    accessToken,
  );
};

export const createPost = createFeed;
