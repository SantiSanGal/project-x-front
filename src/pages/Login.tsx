import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/loginStore";
import { useNavigate } from "react-router-dom";
import { millionApi } from "@/api/million.api";
import { Modal, Spinner } from "@/components";
import { useState } from "react";

interface LoginFormData {
  username: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  const loginAction = useUserStore((state) => state.login);
  const [modalOpen, setModalOpen] = useState(false);

  const { isPending, isSuccess, isError, error, mutate, reset } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await millionApi.post<{ data: { token: { token: string } } }>(
        "/auth/login",
        { username: data.username, password: data.password }
      );
      return response;
    },
    onSuccess: (response) => {
      const token = response.data.data.token.token;
      if (token) {
        loginAction(token); // Guarda la sesión del usuario en el store
        navigate("/"); // Redirige a la ruta "/"
      }
    },
    onError: (err: any) => {
      console.error("Login error:", err);
      // No es necesario gestionar estados adicionales; usaremos `mutation.isError` y `mutation.error`
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    mutate(data);
  };

  const handleSetModalOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    setModalOpen((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      if (!newValue) {
        reset();
      }
      return newValue;
    });
  };


  return (
    <>
      <div className="w-screen min-h-screen flex items-center justify-center bg-stone-900">
        <div className="flex flex-col justify-center p-4 rounded-md bg-stone-800 shadow-lg">
          <form
            className="text-aliceblue max-w-[500px] min-w-[400px] min-h-[200px] w-[40vw] flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-xl font-semibold text-white">
              Sign in to <span className="text-lime-600">Pixel War</span>
            </h2>

            <label className="text-white">User</label>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              name="username"
              className="text-white bg-stone-900 border-none text-aliceblue p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600"
            />
            {errors.username && (
              <p className="text-[#C7253E] text-sm">
                {String(errors.username.message)}
              </p>
            )}

            <label className="text-white">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              type="password"
              name="password"
              className="text-white bg-stone-900 border-none text-aliceblue p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600"
            />
            {errors.password && (
              <p className="text-[#C7253E] text-sm">
                {String(errors.password.message)}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-colors ${isPending && "opacity-50 cursor-not-allowed"
                }`}
            >
              {isPending ? <div className="w-full flex items-center justify-center"><Spinner /></div> : "Login"}
            </button>
          </form>

          <p className="text-white text-aliceblue mt-2 cursor-pointer">
            New to Pixel War? &nbsp;
            <span
              onClick={() => navigate("/register")}
              className="text-lime-600 hover:text-lime-700 transition-colors"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      {/* Modal para mostrar errores: se muestra si ocurre un error en la mutación */}
      <Modal openModal={modalOpen} setOpenModal={handleSetModalOpen}>
        <div className="text-white">
          <h3>Error en el login</h3>
          <p>
            {((error as any)?.response?.data?.message as string) ||
              "Error en el login"}
          </p>
        </div>
      </Modal>
    </>
  );
};
