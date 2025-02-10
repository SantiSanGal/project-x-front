import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React from "react";

export const ProfilePicture: React.FC = () => {
  return (
    <Avatar className="size-10 cursor-pointer">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
