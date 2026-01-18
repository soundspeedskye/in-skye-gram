import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

// <Database>를 넣으면 이제부터 테이블 이름 자동완성이 됩니다!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
