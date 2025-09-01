// src/store/socket/SocketContext.tsx
import React, { createContext, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useUserStore } from "@/store/loginStore";
import { useSocket } from "@/hooks/useSocket";

type SocketContextProps = {
  socket: Socket | null;
  online: boolean;
  reconnect: () => void;
  disconnect: () => void;
  emitAck: <Req = any, Res = any>(
    event: string,
    data?: Req,
    timeoutMs?: number
  ) => Promise<Res>;
};

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  online: false,
  reconnect: () => {},
  disconnect: () => {},
  emitAck: async () => {
    throw new Error("Socket no inicializado");
  },
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLogged, accessToken } = useUserStore(); // <-- ajusta a tu store

  const { socket, online, reconnect, disconnect, emitAck } = useSocket({
    enabled: isLogged,
    token: accessToken ?? null,
    // url: import.meta.env.VITE_SOCKET_URL,  // opcional, el hook ya lo toma por defecto
    withCredentials: true,
    // transports: ["websocket"], // descomenta si quieres forzar WS
    debug: import.meta.env.DEV,
  });

  const value = useMemo<SocketContextProps>(
    () => ({ socket, online, reconnect, disconnect, emitAck }),
    [socket, online, reconnect, disconnect, emitAck]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
