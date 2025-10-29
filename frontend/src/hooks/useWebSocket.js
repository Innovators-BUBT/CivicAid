import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(url);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setError(null);
          reconnectAttempts.current = 0;
          
          if (options.onOpen) {
            options.onOpen(ws);
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastMessage(data);
            
            if (options.onMessage) {
              options.onMessage(data, ws);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
            setLastMessage(event.data);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setIsConnected(false);
          
          if (options.onClose) {
            options.onClose(event, ws);
          }

          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError(error);
          
          if (options.onError) {
            options.onError(error, ws);
          }
        };

        setSocket(ws);
      } catch (err) {
        console.error('Error creating WebSocket:', err);
        setError(err);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && isConnected) {
      try {
        const data = typeof message === 'string' ? message : JSON.stringify(message);
        socket.send(data);
        return true;
      } catch (err) {
        console.error('Error sending WebSocket message:', err);
        setError(err);
        return false;
      }
    }
    return false;
  };

  const disconnect = () => {
    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }
  };

  return {
    socket,
    isConnected,
    lastMessage,
    error,
    sendMessage,
    disconnect
  };
};

export default useWebSocket;
