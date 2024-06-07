import { useEffect, useState } from 'react';

const useSocket = () => {
  console.log('useSocket');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socketInstance = new WebSocket('ws://localhost:3000');
    socketInstance.onopen = (event) => {
      console.log('Web socket connection established', event);
    };

    socketInstance.onclose = (event) => {
      console.log('Web socket closed', event);
    };

    socketInstance.onerror = (event) => {
      console.log('Web socket error', event);
    };

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  return socket;
};

export default useSocket;
