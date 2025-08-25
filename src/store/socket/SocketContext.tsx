import { useUserStore } from "@/store/loginStore";
import { createContext, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  online: boolean;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  online: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLogged } = useUserStore();

  // Solo conecta si el usuario está logueado.
  // Puedes modificar useSocket para que si recibe una URL vacía o nula, no intente conectar.
  const { socket, online } = useSocket(isLogged ? "http://localhost:3333" : "");

  // Si el usuario cierra sesión, desconecta el socket.
  useEffect(() => {
    if (!isLogged && socket) {
      socket.disconnect();
    }
  }, [isLogged, socket]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
