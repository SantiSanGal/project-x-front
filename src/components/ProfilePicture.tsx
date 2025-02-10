import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ProfilePicture: React.FC = () => {
    return (
        <Avatar className="size-10 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
};
