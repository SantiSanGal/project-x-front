import InfiniteCanvas from "./pages/Home/InfiniteCanvas";
import { useUserStore } from "./store";
import React from "react";
import { ProfilePicture, SessionManager } from "./components";

const App: React.FC = () => {
  const { isLogged } = useUserStore.getState();

  return (
    <div className="relative w-screen h-screen overflow-hidden p-0 m-0">
      <ProfilePicture />

      <InfiniteCanvas isLogged={isLogged} />
      <SessionManager />
    </div>
  );
};

export default App;
