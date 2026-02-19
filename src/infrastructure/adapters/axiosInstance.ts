import axios from "axios";
import { useAuthStore } from "../../app/store/useStore";

const apiUrl = import.meta.env.VITE_API_SERVER;

export const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const { logout } = useAuthStore.getState();
      logout();
    }

    return Promise.reject(error);
  },
);
