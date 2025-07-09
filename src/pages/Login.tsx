import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/loginStore";
import { postLogin } from "@/core/actions/auth";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components";
import { useState } from "react";
import { toast } from "sonner";
import { decodeJwt } from "@/utils";
import { millionApi } from "@/api/million.api";

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

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      // Envías el objeto completo como lo estabas haciendo
      const response = await millionApi.post('/auth/googleAuth', { credentialResponse });

      console.log('Respuesta del backend:', response);
      console.log('Respuesta del backend:', response.data);

      // Aquí está la clave: guarda el token de la API
      const { token, user } = response.data;


      // Guarda el token en localStorage para usarlo en futuras peticiones
      localStorage.setItem('api_token', token);

      // Guarda los datos del usuario en el estado de tu app (Context, Redux, etc.)
      // Por ejemplo:
      // login(user);

      // Actualiza la instancia de Axios para incluir el token en todas las peticiones
      millionApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirige al usuario al dashboard o a la página principal
      // window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error al autenticar con el backend:', error);
      // Muestra un mensaje de error al usuario
    }
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
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => { }} />
          </div>
        </div>
      </div>
    </div>
  );
};
