import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components";
import { Brush, Info, Loader, LogIn, ShoppingBasket } from "lucide-react";
import { postLogout } from "@/core/actions/auth";
import { useUserStore } from "@/store";

export const ProfilePicture = () => {
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
    <div className="absolute  right-4 top-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="size-10 cursor-pointer ">
          <Avatar
            className={cn("size-10 cursor-pointer border-2", {
              "border-lime-500": isLogged,
              "border-red-500": !isLogged,
            })}
          >
            <AvatarImage src="/images/icon.png" />
            <AvatarFallback>TP</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="bg-stone-700 text-md shadow-2xl"
        >
          <DropdownMenuItem
            className="cursor-pointer hover:bg-stone-800 text-white text-base"
            onClick={() => navigate("/")}
          >
            <Brush />
            Canvas
          </DropdownMenuItem>
          {isLogged && (
            <DropdownMenuItem
              className="cursor-pointer hover:bg-stone-800 text-white text-base"
              onClick={() => navigate("/purchases")}
            >
              <ShoppingBasket />
              Purchases
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer hover:bg-stone-800 text-white text-base"
            onClick={() => navigate("/about")}
          >
            <Info />
            About
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="text-base cursor-pointer hover:bg-stone-800 text-white"
            onClick={handleAuth}
          >
            {isPending ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <LogIn /> {isLogged ? "Logout" : "Login"}
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
