import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url: string | undefined) => {
    console.log("url", url);

    const socket: React.MutableRefObject<Socket | null> = useRef(null);

    useEffect(() => {
        if (url) {
            socket.current = io(url, {
                path: '/socket.io',
                transports: ['websocket', 'polling'],
                rejectUnauthorized: false
            });
            socket.current.on('connect', () => {
                console.log('Socket connected:', socket.current?.id);
            });

            // Clean up on unmount
            return () => {
                if (socket.current) {
                    socket.current.off('connect'); // Remove the connect listener
                    socket.current.disconnect();
                }
            };
        }
    }, [url]);

    return socket.current;
};

export default useSocket;