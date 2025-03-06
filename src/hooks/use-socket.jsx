import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create socket instance outside component to prevent multiple connections
const socket = io('http://localhost:9000');

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [renderStatus, setRenderStatus] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('renderStart', (data) => {
      setRenderStatus(prev => ({
        ...prev,
        [data.uploadId]: { status: 'rendering', progress: 0 }
      }));
    });

    socket.on('renderProgress', (data) => {
      setRenderStatus(prev => ({
        ...prev,
        [data.uploadId]: { status: 'rendering', progress: data.progress }
      }));
    });

    socket.on('renderComplete', (data) => {
      setRenderStatus(prev => ({
        ...prev,
        [data.uploadId]: { status: 'completed', progress: 100, outputPath: data.outputPath }
      }));
    });

    socket.on('renderError', (data) => {
      setRenderStatus(prev => ({
        ...prev,
        [data.uploadId]: { status: 'error', error: data.error }
      }));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('renderStart');
      socket.off('renderProgress');
      socket.off('renderComplete');
      socket.off('renderError');
    };
  }, []);

  return {
    socket,
    isConnected,
    renderStatus
  };
}