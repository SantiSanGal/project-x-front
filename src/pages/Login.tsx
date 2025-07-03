import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/loginStore";
import { postLogin } from "@/core/actions/auth";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components";
import { useState } from "react";
import { toast } from "sonner";

interface LoginFormData {
  username: string;
  password: string;
}

const EyeOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeClosedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className="fill-blue-500"
  >
    <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z"></path>
    <path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z"></path>
    <path d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z"></path>
    <path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z"></path>
  </svg>
);

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
        loginAction(token, expires_at);
        toast.success("¡Welcome again!");
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

  return (
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
            <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-stone-200 bg-stone-800 border border-stone-700 rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">
              <GoogleIcon />
              <span className="ml-3">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
