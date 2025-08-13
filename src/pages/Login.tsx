import { useForm, SubmitHandler } from "react-hook-form";
import { EyeClosedIcon } from "@/icons/EyeCloseIcon";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/loginStore";
import { EyeOpenIcon } from "@/icons/EyeOpenIcon";
import { postLogin } from "@/core/actions/auth";
import { useNavigate } from "react-router-dom";
import { millionApi } from "@/api/million.api";
import { Spinner } from "@/components";
import { useState } from "react";
import { toast } from "sonner";
import {
  GoogleOAuthProvider,
  CredentialResponse,
  GoogleLogin,
} from "@react-oauth/google";

interface LoginFormData {
  username: string;
  password: string;
}

export const Login = () => {
  const loginAction = useUserStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { isPending, mutate } = useMutation({
    mutationFn: (params: LoginFormData) => postLogin(params),
    onSuccess: (data) => {
      const { token, expires_at } = data.data.token;
      if (token && expires_at) {
        console.log("log token", token);
        loginAction(token, expires_at);
        toast.success("¡Welcome!");
        navigate("/");
      }
    },
    onError: (error: any) => {
      const messages = error?.response?.data?.messages || [
        "An unexpected error has occurred.",
      ];
      messages.forEach((message: string) => toast.error(message));
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    mutate(data);
  };

  const handleGoogleSuccess = async (cred: CredentialResponse) => {
    const credential = cred?.credential;
    if (!credential) return toast.error("No Google credential received");

    const { data } = await millionApi.post("/auth/googleAuth", { credential });
    const { token } = data.data;
    if (token?.token) {
      const accessToken = token.token;
      const expiresAt = token.expiresAt || token.expires_at;
      useUserStore.getState().login(accessToken, expiresAt);
      millionApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      toast.success("Welcome!");
      navigate("/");
    }
  };

  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={client_id}>
      <div className="flex w-full min-h-screen font-sans text-stone-100">
        {/* ----------------------------- Panel Izquierdo ---------------------------- */}
        <div className="hidden md:flex md:w-1/2 lg:w-5/12 flex-col justify-between p-12 bg-gradient-to-tr from-stone-900 via-lime-900 to-stone-900">
          <div>
            <h1 className="text-3xl font-bold text-white">Tatakae Pixel</h1>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">
              A love letter for Mom.
            </h2>
            {/* <p className="mt-4 text-stone-300">Una carta de amor para mamá.</p> */}
          </div>
        </div>

        {/* ------------------------------ Panel derecho ----------------------------- */}
        <div className="flex items-center justify-center w-full p-8 bg-stone-900 md:w-1/2 lg:w-7/12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-white">Login</h2>
            <p className="mt-2 text-stone-400">
              New to Tatakae Pixel?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-medium text-lime-500 hover:text-lime-400 cursor-pointer transition-colors"
              >
                Sign up
              </span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-stone-300"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-300"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-400 hover:text-lime-500"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* --- Opciones de Formulario --- */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-4 h-4 rounded accent-lime-600 bg-stone-700 border-stone-600 focus:ring-lime-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="block ml-2 text-stone-400"
                  >
                    Remember me
                  </label>
                </div>
                {/* TODO: Hacer que esto funcione */}
                <div className="font-medium text-lime-500 hover:text-lime-400 cursor-pointer">
                  Forgot your password?
                </div>
              </div>

              {/* --- Botón de Envío --- */}
              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-lime-600 border border-transparent rounded-md shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? <Spinner /> : "Login"}
                </button>
              </div>
            </form>

            {/* --- Separador y Login Social --- */}
            <div className="relative mt-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-stone-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-stone-900 text-stone-500">
                  Or login with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};
