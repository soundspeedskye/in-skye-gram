```javascript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// 🔐 사용자 인증용
const authClient = createClient(supabaseUrl, anonKey);

// 🛠️ 관리자용
const adminClient = createClient(supabaseUrl, serviceKey);

const BUCKET = "uploads";

const DEFAULT_IMAGES = [
  "https://picsum.photos/500/500?random=1",
  "https://picsum.photos/500/500?random=2",
];

// 공통 CORS 헤더
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ✅ Method 제한
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Method Not Allowed" }),
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    // 1️⃣ Authorization 검증
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: corsHeaders },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ message: "authClient Invalid JWT" }),
        { status: 401, headers: corsHeaders },
      );
    }

    const userId = user.id;

    // 2️⃣ FormData 파싱
    const formData = await req.formData();
    const caption = (formData.get("caption") as string) ?? "";
    const files = formData.getAll("images").filter(
      (v): v is File => v instanceof File,
    );

/** RN 에서 에러나면 이걸로 변경해보기
 * const rawImages = formData.getAll("images");

const files: File[] = rawImages
  .map((v) => {
    if (v instanceof File) return v;
    if (v instanceof Blob) {
      return new File([v], 'image.jpg', { type: v.type });
    }
    return null;
  })
  .filter((v): v is File => v !== null);
 */

    // 3️⃣ feed 생성
    const { data: feed, error: feedError } = await adminClient
      .from("feeds")
      .insert({
        user_id: userId,
        caption,
        images: [],
      })
      .select()
      .single();

    if (feedError || !feed) {
      throw new Error(feedError?.message ?? "Feed create failed");
    }

    const feedId = feed.id;
    let imageUrls: string[] = [];

    // 4️⃣ 이미지 업로드
    if (files.length === 0) {
      imageUrls = DEFAULT_IMAGES;
    } else {
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/feeds/${feedId}/${crypto.randomUUID()}.${ext}`;
        const { data, error } = await adminClient.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });

        if (error || !data) {
          throw new Error(error?.message ?? "Upload failed");
        }

        const { data: urlData } = adminClient.storage
          .from(BUCKET)
          .getPublicUrl(data.path);

        imageUrls.push(urlData.publicUrl);
      }
    }

    // 5️⃣ feed 업데이트
    const { error: updateError } = await adminClient
      .from("feeds")
      .update({ images: imageUrls })
      .eq("id", feedId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return new Response(
      JSON.stringify({ id: feedId, images: imageUrls }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message ?? "Server Error" }),
      { status: 500, headers: corsHeaders },
    );
  }
});

```