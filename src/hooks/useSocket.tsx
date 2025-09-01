// src/hooks/useSocket.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type UseSocketOptions = {
  /** si no pasas, toma import.meta.env.VITE_SOCKET_URL */
  url?: string;
  /** si es false, no crea/conecta el socket */
  enabled?: boolean;
  /** token JWT (o similar) si tu server lo valida en handshake */
  token?: string | null;
  /** path del endpoint; default de socket.io es /socket.io */
  path?: string;
  /** cookies / credenciales cross-site si usas sesiones */
  withCredentials?: boolean;
  /** deja undefined para permitir polling+ws; o ['websocket'] para forzar ws */
  transports?: Array<"websocket" | "polling">;
  /** logs en consola cuando estás en dev */
  debug?: boolean;
};

export function useSocket({
  url = import.meta.env.VITE_SOCKET_URL,
  enabled = true,
  token = null,
  path = "/socket.io",
  withCredentials = true,
  transports, // undefined = comportamiento default (polling + websocket)
  debug = import.meta.env.DEV,
}: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [online, setOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);

  const destroy = useCallback(() => {
    if (socketRef.current) {
      try {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }
    setOnline(false);
  }, []);

  const createAndConnect = useCallback(() => {
    const u = url?.trim();
    if (!enabled || !u) {
      destroy();
      return;
    }

    // cierra instancia previa por si cambió url/token
    destroy();

    const s = io(u, {
      path,
      withCredentials,
      auth: token ? { token } : undefined,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 10000,
      transports, // si dejas undefined, socket.io hace fallback a polling si hace falta
    });

    s.on("connect", () => {
      console.log("connect");
      setOnline(true);
      setError(null);
      setConnectedAt(Date.now());
      if (debug) console.log("[socket] connected", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("disconnect");
      setOnline(false);
      if (debug) console.log("[socket] disconnected:", reason);
    });

    s.on("connect_error", (err: any) => {
      console.log("connect_error", err);
      setOnline(false);
      setError(err?.message ?? String(err));
      if (debug) console.error("[socket] connect_error:", err);
    });

    socketRef.current = s;
  }, [url, enabled, token, path, withCredentials, transports, debug, destroy]);

  // (re)crear socket cuando cambia url / token / enabled
  useEffect(() => {
    createAndConnect();
    return () => destroy();
  }, [createAndConnect, destroy]);

  // Reaccionar a cambios de conectividad del navegador
  useEffect(() => {
    const onOnline = () => {
      if (socketRef.current && !socketRef.current.connected) {
        socketRef.current.connect();
      } else if (enabled && url && !socketRef.current) {
        createAndConnect();
      }
    };
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [createAndConnect, enabled, url]);

  // helpers
  const reconnect = useCallback(() => socketRef.current?.connect(), []);
  const disconnect = useCallback(() => socketRef.current?.disconnect(), []);

  // emit con ack + timeout
  const emitAck = useCallback(
    <Req = any, Res = any>(event: string, data?: Req, timeoutMs = 10000) => {
      return new Promise<Res>((resolve, reject) => {
        const s = socketRef.current;
        if (!s) return reject(new Error("Socket no conectado"));
        let timer: any;
        const ack = (response: Res) => {
          clearTimeout(timer);
          resolve(response);
        };
        timer = setTimeout(
          () => reject(new Error(`Ack timeout para "${event}"`)),
          timeoutMs
        );
        s.emit(event, data, ack);
      });
    },
    []
  );

  return {
    socket: socketRef.current,
    online,
    error,
    connectedAt,
    reconnect,
    disconnect,
    emitAck,
  };
}
