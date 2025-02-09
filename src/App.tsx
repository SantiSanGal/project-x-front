import { ProfilePicture } from "@/components/ProfilePicture";
import InfiniteCanvas from "./pages/InfiniteCanvas";
import React from "react";

const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden p-0 m-0">
      <InfiniteCanvas />
      <ProfilePicture />
    </div>
  );
};

export default App;
