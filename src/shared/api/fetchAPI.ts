/**
 * Supabase Edge Function 호출을 위한 유틸리티
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Supabase Edge Function에 multipart/form-data로 요청을 보내는 헬퍼
 */
export const callEdgeFunction = async <T>(
  endpoint: string,
  formData: FormData,
  accessToken: string,
): Promise<T> => {
  if (!accessToken) {
    throw new Error('accessToken is required');
  }

  if (!SUPABASE_KEY) {
    throw new Error('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY is missing');
  }

  const res = await fetch(
    `${SUPABASE_URL}${endpoint}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_KEY,
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Edge Function [${endpoint}] failed (${res.status}): ${errorText}`);
  }

  return res.json();
};
