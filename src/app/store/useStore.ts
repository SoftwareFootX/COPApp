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
  usu_es_administrador: number;
  usu_acceso_a_footx16: number;
  usu_acceso_a_app_footx: number;
  usu_es_super_admin: number;
  usu_es_tercero_cop: number;
  usu_app_footx_visitador: number;
  usu_app_footx_desarrollador: number;
  usu_app_footx_crud_completo: number;
  usu_permite_redisenios: number;
  usu_acceso_a_reportes_cop: number;
  usu_puede_actualizar_fx16: number;
  usu_permiso_imagenes_fxapp: number;
  usu_kinnx_usa_stabilar: number;
  usu_acceso_kinnx_liveapp: number;
  usu_acceso_a_tablero_ml: number;
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
