import { useSocket } from "@/hooks/useSocket";
import { Socket } from "socket.io-client";
import { createContext } from "react";

interface SocketContextProps {
  socket: Socket | null;
  online: boolean;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  online: false,
});

export const SocketProvider = ({ children }: any) => {
  const { socket, online } = useSocket("http://localhost:3333");

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
