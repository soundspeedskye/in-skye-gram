// src/shared/hooks/useAuthListener.ts

import { useEffect } from "react";
import { supabase } from "@/shared/api/supabase";
import { useUserStore } from "../store/useUserStore";

export const useAuthListener = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setIsInit = useUserStore((state) => state.setIsInit);

  useEffect(() => {
    // 1. 초기 세션 확인
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setIsInit(false);
      }
    };

    checkSession();

    // 2. 실시간 상태 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsInit(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsInit]);
};
