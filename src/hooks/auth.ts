import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/loginStore";
import { useNavigate } from "react-router-dom";
import { millionApi } from "@/api/million.api";
import { toast } from "sonner";

export interface RegisterFormData {
    name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    confirm_password: string;
    document: string;
}

export const useRegister = () => {
    const loginAction = useUserStore((state) => state.login);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (params: RegisterFormData) => {
            return millionApi
                .post("/auth/register", {
                    username: params.username,
                    password: params.password,
                    name: params.name,
                    last_name: params.last_name,
                    email: params.email,
                })
                .then(({ data }) => {
                    const { token, expiresAt } = data.data.token;
                    if (token && expiresAt) {
                        loginAction(token, expiresAt);
                        toast.success("¡Welcome!");
                        navigate("/");
                    }
                })
                .catch((err) => {
                    if (err.status == 400) {
                        err.response.data.message.errors.map((error: any) =>
                            toast.error(error.message)
                        );
                    } else {
                        toast.error("Sorry, an error has occurred");
                    }
                });
        },
    });
}