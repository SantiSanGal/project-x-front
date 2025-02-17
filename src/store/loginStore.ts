import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  accessToken: string;
  isLogged: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: "",
      isLogged: false,
      login: (token: string) => set({ accessToken: token, isLogged: true }),
      logout: () => set({ accessToken: "", isLogged: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
