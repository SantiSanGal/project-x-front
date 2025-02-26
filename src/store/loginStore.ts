// loginStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  accessToken: string;
  expiresAt: string | null; // Almacenamos la fecha de expiración en formato ISO
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
      login: (token: string, expiresAt: string) =>
        set({ accessToken: token, expiresAt, isLogged: true }),
      logout: () =>
        set({ accessToken: "", expiresAt: null, isLogged: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
