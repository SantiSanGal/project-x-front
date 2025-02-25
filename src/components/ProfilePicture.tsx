import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface ProfilePictureProps {
  isLogged: boolean;
}

export const ProfilePicture = ({ isLogged }: ProfilePictureProps) => {
  return (
    <Avatar
      className={cn("size-10 cursor-pointer border-2", {
        "border-lime-500": isLogged,
        "border-red-500": !isLogged,
      })}
    >
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
