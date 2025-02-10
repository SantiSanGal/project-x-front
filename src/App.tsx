import { ProfilePicture } from "@/components/ProfilePicture";
import InfiniteCanvas from "./pages/InfiniteCanvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden p-0 m-0">

      <div className="absolute right-4 top-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ProfilePicture />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/about')}>About</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="cursor-pointer">Purchases</DropdownMenuItem> */}
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/login')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <InfiniteCanvas />
    </div>
  );
};

export default App;
