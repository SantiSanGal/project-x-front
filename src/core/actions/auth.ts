import { millionApi } from "@/api/million.api";

interface postLoginParams {
    username: string;
    password: string;
}

export const postLogin = async ({ username, password }: postLoginParams) => {
    try {
        const response = await millionApi.post("/auth/login", { username, password });
        return response;
    } catch (error) {
        throw error;
    }
};
