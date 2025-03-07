import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create socket instance outside component to prevent multiple connections
const socket = io('http://localhost:9000');

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [renderStatus, setRenderStatus] = useState({});

  useEffect(() => {
    // Connect explicitly when component mounts
    if (!socket.connected) {
      socket.connect();
    }

    if(socket.connected && !isConnected) {
      setIsConnected(true);
    }

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

    socket.on('renderAborted', (data) => {
      const keys= Object.keys(renderStatus);
      let obj = {}
      const newStatus = keys.reduce((acc, key) => {
        return { ...acc, [key]: { status: 'aborted', progress: 0 } };
      }, obj);

      setRenderStatus(newStatus)
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('renderStart');
      socket.off('renderProgress');
      socket.off('renderComplete');
      socket.off('renderError');
      socket.off('renderAborted');
    };
  }, []);

  return {
    socket,
    isConnected,
    renderStatus,
    connect: () => {
      if (!socket.connected) {
        socket.connect();
      }
    }
  };
}