import { ProfilePicture } from "@/components/ProfilePicture";
import InfiniteCanvas from "./pages/Home/InfiniteCanvas";
import SessionManager from "./components/SessionManager";
import { useMutation } from "@tanstack/react-query";
import { postLogout } from "./core/actions/auth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "./store";
import { Loader } from "lucide-react";
import { cn } from "./lib/utils";
import React from "react";

const App: React.FC = () => {
  const { isLogged, logout } = useUserStore.getState();
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const response = await postLogout();
      return response;
    },
  });

  const handleAuth = async () => {
    if (isLogged) {
      mutate();
      logout();
    }
    navigate("/login");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden p-0 m-0">
      <div className="absolute  right-4 top-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="size-10 cursor-pointer ">
            <ProfilePicture isLogged={isLogged} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className={cn("bg-stone-700  shadow-2xl", {
              "border-lime-600 border-2": isLogged,
              "border-red-600 border-2": !isLogged,
            })}
          >
            <DropdownMenuItem
              className={cn(
                "cursor-pointer hover:bg-stone-800 text-white text-base"
                //   {
                //   "text-lime-600": isLogged,
                //   "text-red-600": !isLogged,
                // }
              )}
              onClick={() => navigate("/about")}
            >
              About
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isPending}
              className={cn(
                "text-base cursor-pointer hover:bg-stone-800 text-white "
                // {
                //   "text-lime-600": isLogged,
                //   "text-red-600": !isLogged,
                // }
              )}
              onClick={handleAuth}
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <>{isLogged ? "Logout" : "Login"}</>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <InfiniteCanvas isLogged={isLogged} />
      <SessionManager />
    </div>
  );
};

export default App;
