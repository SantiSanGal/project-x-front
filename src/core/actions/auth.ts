import { millionApi } from "@/api/million.api";

interface postLoginParams {
  username: string;
  password: string;
}

export const postLogin = async ({ username, password }: postLoginParams) => {
  try {
    const { data } = await millionApi.post("/auth/login", {
      username,
      password,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const postLogout = async () => {
  try {
    const response = await millionApi.post("/auth/logout");
    return response;
  } catch (error) {
    throw error;
  }
};
