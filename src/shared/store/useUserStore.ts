import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  // 로그인한 유저 정보
  user: User | null;
  setUser: (user: User | null) => void;
  isInit: boolean;
  setIsInit: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isInit: true,
      setIsInit: (value) => set({ isInit: value }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
