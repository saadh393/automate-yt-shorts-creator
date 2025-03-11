import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create socket instance outside component to prevent multiple connections
const socket = io("http://localhost:9000");

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [renderStatus, setRenderStatus] = useState({});
  const [isRendering, setIsRender] = useState(false);

  useEffect(() => {
    // Connect explicitly when component mounts
    if (!socket.connected) {
      socket.connect();
    }

    if (socket.connected && !isConnected) {
      setIsConnected(true);
    }

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsRender(false);
      setIsConnected(false);
    });

    /**
     * @enum {Object}
     */
    const StatusType = {
      STARTED: "started",
      ERROR: "error",
      VALIDATION: "validation",
      FFMPEG: "ffmpeg",
      SUBTITLE: "subtitle",
      RENDER: "rendering",
      PROGRESS: "render_progress",
      REMOVE_TEMP: "temp",
      COMPLETE: "complete",
    };

    // data - {id, status, message}
    socket.on("render_progress", (data) => {
      // console.log(renderStatus);
      // console.log(data);
      setRenderStatus((prev) => ({
        ...prev, // spread existing state
        [data.id]: data, // update the specific id
      }));
    });

    socket.on("render", (data) => {
      setIsRender(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("render_progress");
      socket.off("render");
    };
  }, []);

  return {
    socket,
    isConnected,
    renderStatus,
    isRendering,
    connect: () => {
      if (!socket.connected) {
        socket.connect();
      }
    },
  };
}
