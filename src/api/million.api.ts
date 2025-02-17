import { useUserStore } from "@/store/loginStore";
import axios from "axios";

export const millionApi = axios.create({
  baseURL: "http://localhost:3333",
});

millionApi.interceptors.request.use(
  (config) => {
    const { accessToken } = useUserStore.getState();

    // Aseguramos que config.data sea un objeto (útil para peticiones POST/PUT)
    if (typeof config.data !== "object" || config.data === null) {
      config.data = {};
    }

    // Inyectamos el accessToken en los datos de la petición
    config.data = {
      ...config.data,
      accessToken,
    };

    return config;
  },
  (error) => Promise.reject(error)
);
