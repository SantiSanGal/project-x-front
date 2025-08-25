// src/store/loginStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  accessToken: string;
  expiresAt: string | null;
  isLogged: boolean;
  login: (token: string, expiresAt: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: "",
      expiresAt: null,
      isLogged: false,
      login: (token: string, expiresAt: string) => {
        set({ accessToken: token, expiresAt, isLogged: true });
      },
      logout: () => set({ accessToken: "", expiresAt: null, isLogged: false }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      // (opcional) guarda solo lo necesario
      // partialize: (state) => ({ accessToken: state.accessToken, expiresAt: state.expiresAt, isLogged: state.isLogged }),
    }
  )
);
