import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Store {
  theme: boolean;
  setTheme: (newTheme: boolean) => void;
}

interface User {
  idtusuarios: number;
  fk_consultorio: number;
  usu_nombre: string;
  usu_apellido: string;
  usu_username: string;
  usu_email: string;
  usu_telefono: string;
  usu_celular: string;
  usu_app_footx_administrador: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

const useStore = create<Store>((set) => ({
  theme: false,
  setTheme: (newTheme: boolean) => set({ theme: newTheme }),
}));

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export { useStore, useAuthStore };
