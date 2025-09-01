import { useForm, SubmitHandler } from "react-hook-form";
import { EyeClosedIcon } from "@/icons/EyeCloseIcon";
// import { useUserStore } from "@/store/loginStore";
import { EyeOpenIcon } from "@/icons/EyeOpenIcon";
// import { GoogleIcon } from "@/icons/GoogleIcon";
import { useNavigate } from "react-router-dom";
// import { millionApi } from "@/api/million.api";
import LavaPixels from "@/components/LavaPixel";
// import ReCAPTCHA from "react-google-recaptcha";
import { useRegister } from "@/hooks/auth";
import { Spinner } from "@/icons/Spinner";
import { useState } from "react";
// import { toast } from "sonner";

interface RegisterFormData {
  name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  document: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const Register = () => {
  // const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  // const RECATCHA = import.meta.env.VITE_GOOGLE_RECATCHA as string;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // const loginAction = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { isPending, mutate } = useRegister();

  // const handleGoogleSignUp = () => {
  //   if (!window.google) {
  //     toast.error("Google SDK not loaded");
  //     return;
  //   }

  //   window.google.accounts.id.initialize({
  //     client_id: GOOGLE_CLIENT_ID,
  //     callback: async (resp: any) => {
  //       try {
  //         const credential = resp?.credential;
  //         if (!credential) {
  //           toast.error("No Google credential received");
  //           return;
  //         }
  //         await millionApi
  //           .post("/auth/googleAuth", {
  //             credential,
  //           })
  //           .then(({ data }) => {
  //             const { token, expiresAt } = data.data.token;
  //             if (token && expiresAt) {
  //               loginAction(token, expiresAt);
  //               toast.success("¡Welcome!");
  //               navigate("/");
  //             }
  //           });
  //       } catch (e: any) {
  //         console.error(e);
  //         toast.error(e?.response?.data?.message || "Google auth failed");
  //       }
  //     },
  //     ux_mode: "popup", // <-- evita redirecciones y reduce conflictos COOP
  //     itp_support: true, // <-- útil en Safari
  //   });

  //   window.google.accounts.id.prompt();
  // };

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex w-full min-h-screen font-sans text-stone-100">
      <div
        className="relative hidden md:flex md:w-1/2 lg:w-5/12 flex-col justify-between p-12
                bg-gradient-to-tr from-stone-900 via-lime-900 to-stone-900 overflow-hidden"
      >
        {/* efecto (debajo del contenido, sobre el gradiente) */}
        <LavaPixels
          className="absolute inset-0 z-0"
          // green="#65a30d" // usa tu tono
          green="#4d7c0f" // usa tu tono
          alpha={0.9} // cuán “negros”/intensos se ven
          speed={56} // velocidad de la forma (no de los píxeles)
        />

        {/* contenido por encima */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Tatakae Pixel</h1>
        </div>

        <div className="relative z-10">
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
            {/* <div className="flex justify-center pt-2">
              <ReCAPTCHA
                sitekey={RECATCHA}
                onChange={(val) => setCaptchaValue(val)}
                theme="dark"
              />
            </div> */}

            {/* --- Botón de Envío --- */}
            <div>
              <button
                type="submit"
                // disabled={!captchaValue || isPending}
                disabled={isPending}
                className="flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-lime-600 border border-transparent rounded-md shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? <Spinner /> : "Create Account"}
              </button>
            </div>
          </form>

          {/* --- Separador y Login Social (Idéntico al Login) --- */}
          {/* <div className="relative mt-6">
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
          </div> */}

          {/* <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-stone-200 bg-stone-800 border border-stone-700 rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            >
              <GoogleIcon />
              <span className="ml-3">Google</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
