import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { useUserStore } from "@/store/loginStore";

export const millionApi = axios.create({
  baseURL: "http://localhost:3333",
});

millionApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore.getState();
    if (accessToken) {
      // Si headers ya es una instancia de AxiosHeaders y tiene el método set, úsalo.
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        // Si no, crea una instancia de AxiosHeaders con el header Authorization.
        config.headers = AxiosHeaders.from({
          Authorization: `Bearer ${accessToken}`,
        });
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
