'use client';

import { useEffect, useRef, useState } from 'react';
import { socketManager } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

interface UseSocketOptions {
  serverUrl?: string;
  autoConnect?: boolean;
}

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { 
    serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', 
    autoConnect = true 
  } = options;
  
  const [socketState, setSocketState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!autoConnect) return;

    setSocketState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const socket = socketManager.connect(serverUrl);
      socketRef.current = socket;

      const handleConnect = () => {
        setSocketState({
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      };

      const handleDisconnect = () => {
        setSocketState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));
      };

      const handleConnectError = (error: Error) => {
        setSocketState({
          isConnected: false,
          isConnecting: false,
          error: error.message,
        });
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);

      // Set initial state if already connected
      if (socket.connected) {
        handleConnect();
      }

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
      };
    } catch (error) {
      setSocketState({
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      });
    }
  }, [serverUrl, autoConnect]);

  const connect = () => {
    if (socketRef.current?.connected) return;
    
    setSocketState(prev => ({ ...prev, isConnecting: true, error: null }));
    socketManager.connect(serverUrl);
  };

  const disconnect = () => {
    socketManager.disconnect();
    setSocketState({
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  return {
    socket: socketRef.current,
    socketManager,
    ...socketState,
    connect,
    disconnect,
  };
}
