import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSocket } from "@/hooks/use-socket";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

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
  IMAGE: "IMAGE",
};
const restofTheStatus = [
  StatusType.STARTED,
  StatusType.VALIDATION,
  StatusType.FFMPEG,
  StatusType.SUBTITLE,
  StatusType.RENDER,
  StatusType.REMOVE_TEMP,
  StatusType.IMAGE,
];

export default function RenderedPage() {
  const [data, setData] = useState([]);
  const [localProcessing, setLocalProcessing] = useState(false); // local spinner state
  const { isConnected, renderStatus, connect, isRendering } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fetch-json");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    connect();
  }, []);

  // Watch isRendering to turn off local spinner if backend signals done
  useEffect(() => {
    if (!isRendering) setLocalProcessing(false);
  }, [isRendering]);

  const handleStartProcessing = async () => {
    setLocalProcessing(true);
    try {
      await fetch("/api/process-content-list", { method: "GET" });
      // No need to wait for response, backend is now async
    } catch (error) {
      setLocalProcessing(false);
      console.error("Error starting processing:", error);
    }
  };

  // Find the currently processing item (first with a running status)
  const runningId = Object.entries(renderStatus).find(
    ([, v]) =>
      v.status &&
      [
        StatusType.STARTED,
        StatusType.VALIDATION,
        StatusType.FFMPEG,
        StatusType.SUBTITLE,
        StatusType.RENDER,
        StatusType.REMOVE_TEMP,
        StatusType.IMAGE,
        StatusType.PROGRESS,
      ].includes(v.status)
  )?.[0];

  return (
    <>
      <div className="text-sm text-gray-500 flex justify-between mb-8">
        {isConnected ? (
          <span className="text-green-500 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
            Connected to server
          </span>
        ) : (
          <span className="text-red-500 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
            Disconnected
          </span>
        )}
        <Button
          onClick={handleStartProcessing}
          className="text-right mr-0 gap-2 items-center justify-center"
          variant="secondary"
          disabled={localProcessing || isRendering || !data.length}
        >
          {(localProcessing || isRendering) && <Loader className="animate-spin h-4 w-4 " />}
          {localProcessing || isRendering ? "Processing..." : "Start Processing"}
        </Button>
      </div>
      <ul className="mt-2 space-y-2 divide-y ">
        {data.map((item, index) => {
          const statusObj = renderStatus[item.ID];
          const isRunning = runningId === item.ID;
          return (
            <li key={index} className={`pt-4 ${isRunning ? "bg-zinc-900/40 border-l-4 border-blue-500" : ""}`}>
              <div className="flex justify-between mb-1">
                <span className={`font-medium flex items-center gap-2 ${isRunning ? "text-blue-400" : ""}`}>
                  {isRunning && <Loader className="animate-spin h-4 w-4 inline-block" />}
                  {statusObj && statusObj.status === StatusType.COMPLETE && (
                    <div className="text-green-500 text-xs">{statusObj.message}</div>
                  )}
                  {item.Title}
                  {isRunning && (
                    <span className="ml-2 text-xs bg-blue-900/60 px-2 py-0.5 rounded text-blue-200">Processing</span>
                  )}
                </span>
                <span className="text-sm text-gray-500">{item.ID}</span>
              </div>
              {statusObj && (
                <div>
                  {statusObj.status === StatusType.PROGRESS && (
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Rendering...</span>
                        <span>{statusObj.message}%</span>
                      </div>
                      <Progress value={statusObj.message} />
                    </div>
                  )}
                  {isRendering && statusObj.status === StatusType.ERROR && (
                    <div className="text-red-500 text-sm">Error: {statusObj.message}</div>
                  )}
                  {isRendering && restofTheStatus.includes(statusObj.status) && (
                    <AnimatedShinyText className="inline-flex items-center justify-center py-1 transition ease-out">
                      <span>{statusObj.message}</span>
                    </AnimatedShinyText>
                  )}
                </div>
              )}
              {!statusObj && <div className={`text-xs text-gray-400`}>{item.Upload}</div>}
            </li>
          );
        })}
      </ul>
      {data.length === 0 && (
        <div className="min-h-60 bg-neutral-900 grid place-items-center my-8 rounded-md">
          <p className="text-sm text-neutral-400 text-center">No Data in Rendered List </p>
        </div>
      )}
    </>
  );
}
