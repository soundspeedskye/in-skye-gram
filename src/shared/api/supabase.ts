import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log("URL 확인:", supabaseUrl);
console.log("KEY 확인:", supabaseKey);

if (!supabaseUrl) {
  console.error("🚨 .env 파일이 제대로 로드되지 않았습니다!");
}

// <Database>를 넣으면 이제부터 테이블 이름 자동완성이 됩니다!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
