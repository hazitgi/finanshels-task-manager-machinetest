import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url: string) => {
    const socket: React.MutableRefObject<Socket | null> = useRef(null);

    useEffect(() => {
        socket.current = io(url);

        return () => {
            socket.current?.disconnect();
        };
    }, [url]);

    return socket.current;
};

export default useSocket;