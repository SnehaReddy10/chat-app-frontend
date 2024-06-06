import { useEffect, useState } from 'react';

const useSocket = () => {
  console.log('useSocket');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socketInstance = new WebSocket('ws://localhost:3000');
    socketInstance.onopen = (event) => {
      console.log('Connected', event);
      setSocket(socketInstance);
    };

    return () => {
      socketInstance.close();
    };
  }, []);

  return socket;
};

export default useSocket;
