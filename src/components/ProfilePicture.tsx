import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ProfilePicture: React.FC = () => {

    return (
        <Avatar
            className="size-10 absolute right-4 top-4 cursor-pointer"
            onClick={() => console.log('xd')}
        >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
};