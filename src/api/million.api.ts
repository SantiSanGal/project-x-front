import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { useUserStore } from "@/store/loginStore";

export const millionApi = axios.create({
  baseURL: "http://localhost:3333",
});

// Interceptor de request
millionApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore.getState();
    if (accessToken) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        config.headers = AxiosHeaders.from({
          Authorization: `Bearer ${accessToken}`,
        });
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// try {
//   const raw = localStorage.getItem("user-storage");
//   if (raw) {
//     const { state } = JSON.parse(raw);
//     const token = state?.accessToken;
//     if (token) {
//       millionApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//   }
// } catch {}

// Interceptor de response para manejar errores 401
// millionApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Llama al método logout de tu store
//       useUserStore.getState().logout();
//       // Redirige a /login
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
