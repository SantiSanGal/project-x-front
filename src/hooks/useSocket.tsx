import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (serverPath: string) => {
    const socket: Socket = useMemo(() => io(serverPath, {
        transports: ['websocket']
    }), [serverPath]);

    const [online, setOnline] = useState(false);

    useEffect(() => {
        setOnline(socket.connected);
    }, [socket]);

    useEffect(() => {
        socket.on('connect', () => {
            // console.log('Socket connected', socket.id);
            setOnline(true);
        });

        socket.on('disconnect', () => {
            setOnline(false);
        });

        // Limpiar eventos al desmontar el componente
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket]);

    return {
        socket,
        online
    };
}
