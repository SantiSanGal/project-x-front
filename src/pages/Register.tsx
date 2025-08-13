import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/loginStore";
import { useNavigate } from "react-router-dom";
import { millionApi } from "@/api/million.api";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { toast } from "sonner";

// --- Tipos para el formulario ---
interface RegisterFormData {
  name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
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
    {" "}
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>{" "}
    <circle cx="12" cy="12" r="3"></circle>{" "}
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
    {" "}
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>{" "}
    <line x1="1" y1="1" x2="23" y2="23"></line>{" "}
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
    {" "}
    <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z"></path>{" "}
    <path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z"></path>{" "}
    <path d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z"></path>{" "}
    <path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z"></path>{" "}
  </svg>
);

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

declare global {
  interface Window {
    google?: any;
  }
}

export const Register = () => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  const RECATCHA = import.meta.env.VITE_GOOGLE_RECATCHA as string;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginAction = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { isPending, mutate } = useMutation({
    mutationFn: (params: RegisterFormData) => {
      return millionApi
        .post("/auth/register", {
          username: params.username,
          password: params.password,
          name: params.name,
          last_name: params.last_name,
          email: params.email,
        })
        .then((res) => {
          console.log(res);
          toast.success("User Registered Successfully");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((err) => {
          if (err.status == 400) {
            err.response.data.message.errors.map((error: any) =>
              toast.error(error.message)
            );
          } else {
            toast.error("Sorry, an error has occurred");
          }
          console.log(err);
        });
    },
    onSuccess: () => {
      toast.success("¡Registro exitoso!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
    onError: (error: any) => {
      const messages = error?.response?.data?.messages || [
        "Ha ocurrido un error inesperado.",
      ];
      messages.forEach((message: string) => toast.error(message));
    },
  });

  const handleGoogleSignUp = () => {
    if (!window.google) {
      toast.error("Google SDK not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        try {
          const credential = resp?.credential;
          if (!credential) {
            toast.error("No Google credential received");
            return;
          }
          const response = await millionApi.post("/auth/googleAuth", {
            credential,
          });
          const { token } = response.data.data; // { type, token, expiresAt }
          if (token?.token) {
            const accessToken = token.token;
            const expiresAt = token.expiresAt || token.expires_at;

            // 1) guardar en Zustand (persist)
            loginAction(accessToken, expiresAt);

            // 2) fijar header para siguientes requests
            millionApi.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;

            // 3) redirigir
            navigate("/");
          }
        } catch (e: any) {
          console.error(e);
          toast.error(e?.response?.data?.message || "Google auth failed");
        }
      },
      ux_mode: "popup", // <-- evita redirecciones y reduce conflictos COOP
      itp_support: true, // <-- útil en Safari
    });

    window.google.accounts.id.prompt();
  };

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex w-full min-h-screen font-sans text-stone-100">
      {/* ----------------------------- Panel Izquierdo (Idéntico al Login) ---------------------------- */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 flex-col justify-between p-12 bg-gradient-to-tr from-stone-900 via-lime-900 to-stone-900">
        <div>
          <h1 className="text-3xl font-bold text-white">Tatakae Pixel</h1>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            A love letter for Mom.
          </h2>
        </div>
      </div>

      {/* ------------------------------ Panel derecho (Formulario de Registro) ----------------------------- */}
      <div className="flex items-center justify-center w-full p-8 bg-stone-900 md:w-1/2 lg:w-7/12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
          <p className="mt-2 text-stone-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-medium text-lime-500 hover:text-lime-400 cursor-pointer transition-colors"
            >
              Login
            </span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {/* --- Campo Nombre y Apellido en una fila --- */}
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-stone-300"
                >
                  {" "}
                  Name{" "}
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    autoComplete="given-name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 25,
                        message: "Name can only contain up to 25 characters",
                      },
                    })}
                    className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500">
                      {" "}
                      {errors.name.message}{" "}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-stone-300"
                >
                  {" "}
                  Last Name{" "}
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    {...register("last_name", {
                      required: "Last Name is required",
                      minLength: {
                        value: 2,
                        message: "Last Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 25,
                        message:
                          "Last Name can only contain up to 25 characters",
                      },
                    })}
                    className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  {errors.last_name && (
                    <p className="mt-2 text-sm text-red-500">
                      {" "}
                      {errors.last_name.message}{" "}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Campo Email --- */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-300"
              >
                {" "}
                Email address{" "}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {" "}
                    {errors.email.message}{" "}
                  </p>
                )}
              </div>
            </div>

            {/* --- Campo Username --- */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-stone-300"
              >
                {" "}
                Username{" "}
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 5,
                      message: "Username must be at least 5 characters",
                    },
                    maxLength: {
                      value: 25,
                      message: "Username can only contain up to 25 characters",
                    },
                    pattern: {
                      value: /^[a-z0-9._-]+$/,
                      message: "Lowercase only. Use a-z 0-9 . _ -",
                    },
                  })}
                  onChange={(e) => {
                    e.target.value = e.target.value.toLowerCase();
                  }}
                  className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md"
                />

                {errors.username && (
                  <p className="mt-2 text-sm text-red-500">
                    {" "}
                    {errors.username.message}{" "}
                  </p>
                )}
              </div>
            </div>

            {/* --- Campo Contraseña --- */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-300"
              >
                {" "}
                Password{" "}
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                  {" "}
                  {errors.password.message}{" "}
                </p>
              )}
            </div>

            {/* --- Campo Confirmar Contraseña --- */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-stone-300"
              >
                {" "}
                Confirm Password{" "}
              </label>
              <div className="relative mt-1">
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="w-full px-3 py-2 text-white bg-stone-800 border border-stone-700 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-400 hover:text-lime-500"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-2 text-sm text-red-500">
                  {" "}
                  {errors.confirm_password.message}{" "}
                </p>
              )}
            </div>

            {/* --- ReCAPTCHA --- */}
            <div className="flex justify-center pt-2">
              <ReCAPTCHA
                sitekey={RECATCHA}
                onChange={(val) => setCaptchaValue(val)}
                theme="dark"
              />
            </div>

            {/* --- Botón de Envío --- */}
            <div>
              <button
                type="submit"
                disabled={!captchaValue || isPending}
                className="flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-lime-600 border border-transparent rounded-md shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? <Spinner /> : "Create Account"}
              </button>
            </div>
          </form>

          {/* --- Separador y Login Social (Idéntico al Login) --- */}
          <div className="relative mt-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-stone-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-stone-900 text-stone-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-stone-200 bg-stone-800 border border-stone-700 rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            >
              <GoogleIcon />
              <span className="ml-3">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
