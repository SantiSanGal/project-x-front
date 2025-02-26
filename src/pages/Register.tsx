import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useNavigate } from "react-router-dom";
import { millionApi } from "@/api/million.api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// TODO: Mostrar errores de validación
//TODO: Agregar captcha

export const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submit = (data: any) => {
    millionApi
      .post("/auth/register", {
        username: data.username,
        password: data.password,
        name: data.name,
        last_name: data.last_name,
        email: data.email,
      })
      .then((res) => {
        console.log(res);
        toast.success("User Registered Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sorry, an error has occurred");
      });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-900">
      {/* Contenedor principal con altura fija */}
      <div className="max-w-xl w-full bg-stone-700 rounded-md shadow-lg flex flex-col h-[80vh]">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col h-full">
          {/* Header fijo */}
          <header className="p-4 border-b border-stone-600">
            <h2 className="text-xl font-semibold text-[#f0f8ff]">
              Create a <span className="text-lime-600">Pixel War</span> account
            </h2>
          </header>

          {/* Área scrollable para los inputs */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Input: Name */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#f0f8ff]">Name</label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 5,
                    message: "Name must be at least 5 characters",
                  },
                  maxLength: {
                    value: 25,
                    message: "Name can only contain up to 25 characters",
                  },
                })}
                type="text"
                name="name"
                className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
              />
              {errors.name && (
                <p className="text-[#C7253E] text-sm">
                  {String(errors.name.message)}
                </p>
              )}
            </div>

            {/* Input: Last Name */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#f0f8ff]">Last Name</label>
              <input
                {...register("last_name", {
                  required: "Last Name is required",
                  minLength: {
                    value: 5,
                    message: "Last Name must be at least 5 characters",
                  },
                  maxLength: {
                    value: 25,
                    message: "Last Name can only contain up to 25 characters",
                  },
                })}
                type="text"
                name="last_name"
                className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
              />
              {errors.last_name && (
                <p className="text-[#C7253E] text-sm">
                  {String(errors.last_name.message)}
                </p>
              )}
            </div>

            {/* Input: Email */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#f0f8ff]">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  minLength: {
                    value: 5,
                    message: "Email must be at least 5 characters",
                  },
                })}
                type="email"
                name="email"
                className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
              />
              {errors.email && (
                <p className="text-[#C7253E] text-sm">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            {/* Input: Username */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#f0f8ff]">Username</label>
              <input
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
                })}
                type="text"
                name="username"
                className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
              />
              {errors.username && (
                <p className="text-[#C7253E] text-sm">
                  {String(errors.username.message)}
                </p>
              )}
            </div>

            {/* Input: Password */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#f0f8ff]">Password</label>
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
                className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
              />
              {errors.password && (
                <p className="text-[#C7253E] text-sm">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            {/* Input: Confirm Password */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#f0f8ff]">Confirm Password</label>
              <input
                {...register("confirm_password", {
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                type="password"
                name="confirm_password"
                className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
              />
              {errors.confirm_password && (
                <p className="text-[#C7253E] text-sm">
                  {String(errors.confirm_password.message)}
                </p>
              )}
            </div>
          </div>

          {/* Footer fijo */}
          <footer className="p-4 border-t border-stone-600">
            <button
              type="submit"
              className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Sign up
            </button>
            <p className="text-[#f0f8ff] mt-2 text-center">
              Already have a Pixel War account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-lime-600 cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </footer>
        </form>
      </div>
    </div>
  );
};
