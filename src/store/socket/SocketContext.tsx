import { useSocket } from "@/hooks/useSocket";
import { Socket } from "socket.io-client";
import { createContext } from "react";

// Define el tipo del valor del contexto
interface SocketContextProps {
  socket: Socket | null;
  online: boolean;
}

// Proporciona un valor inicial para el contexto
export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  online: false,
});

export const SocketProvider = ({ children }: any) => {
  const { socket, online } = useSocket("http://localhost:3331");

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
