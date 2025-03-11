import getQueueList from "@/api/get-queue-list";
import renderQueueList from "@/api/render-queue-list";
import stopRendering from "@/api/stopRendering";
import { useSocket } from "@/hooks/use-socket";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import clearCacheApi from "@/api/clear-cache";
import { toast } from "sonner";

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
const restofTheStatus = [
  StatusType.STARTED,
  StatusType.VALIDATION,
  StatusType.FFMPEG,
  StatusType.SUBTITLE,
  StatusType.RENDER,
  StatusType.REMOVE_TEMP,
];

export default function QueuePageManager() {
  const [queueList, setQueueList] = useState([]);
  const [isStoppingRender, setIsStoppingRender] = useState(false);
  const [cacheLoading, setCacheLoading] = useState(false);
  const { isConnected, renderStatus, connect, isRendering } = useSocket();

  async function refreshPage() {
    try {
      const data = await getQueueList();

      if (!Array.isArray(data)) {
        return setQueueList([]);
      }

      setQueueList(
        data.map((d, i) => {
          let title = d.split("data-")[1].split(".json")[0].trim(); // data-Deep Web.json

          // Uppercase first letter
          let utitle = title.charAt(0).toUpperCase() + title.slice(1);
          const id = title.replace(/\s+/g, "_"); // Deep_Web
          return { fileName: d, title: utitle, id };
        })
      );
    } catch (error) {}
  }

  async function startRendering() {
    try {
      await renderQueueList();
    } catch (error) {}
  }

  useEffect(() => {
    refreshPage();
    connect();
  }, []);

  async function handleStopRendering() {
    try {
      setIsStoppingRender(true);
      await stopRendering();
    } catch (error) {
    } finally {
      setIsStoppingRender(false);
    }
  }

  async function clearCache() {
    try {
      setCacheLoading(true);
      const data = await clearCacheApi();
      setCacheLoading(false);
      refreshPage();
    } catch (error) {
      console.error(error);
      toast.error("There is something wrong");
      setCacheLoading(false);
    }
  }

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

        <Button size="sm" onClick={clearCache} className="text-right mr-0 gap-2 items-center justify-center" variant="destructive">
          Clear Cache
        </Button>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          onClick={startRendering}
          className="text-right block  mr-0 flex gap-2 items-center justify-center disabled:cursor-not-allowed"
          variant="secondary"
          disabled={isRendering || !queueList.length}
        >
          {/* if isRendering show spninner */}
          {isRendering && <Loader className="animate-spin h-4 w-4 " />}
          {isRendering ? "Rendering..." : "Start Rendering"}
        </Button>
      </div>
      <ul className="mt-2 space-y-2 divide-y ">
        {queueList.map((item) => {
          return (
            <li key={item.id} className="pt-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {renderStatus[item.id] && renderStatus[item.id].status === StatusType.COMPLETE && (
                    <div className="text-green-500 text-xs">{renderStatus[item.id].message}</div>
                  )}
                  {item.title}
                </span>
                <span className="text-sm text-gray-500">{item.fileName}</span>
              </div>

              {renderStatus[item.id] && (
                <div>
                  {renderStatus[item.id].status === StatusType.PROGRESS && (
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Rendering...</span>
                        <span>{renderStatus[item.id].message}%</span>
                      </div>
                      <Progress value={renderStatus[item.id].message} />
                    </div>
                  )}

                  {isRendering && renderStatus[item.id].status === StatusType.ERROR && (
                    <div className="text-red-500 text-sm">Error: {renderStatus[item.id].message}</div>
                  )}

                  {isRendering && restofTheStatus.includes(renderStatus[item.id].status) && (
                    <AnimatedShinyText className="inline-flex items-center justify-center py-1 transition ease-out">
                      <span>✨ {renderStatus[item.id].message}</span>
                    </AnimatedShinyText>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {queueList.length == 0 && (
        <div className="min-h-60 bg-neutral-900 grid place-items-center my-8 rounded-md">
          <p className="text-sm text-neutral-400 text-center">No Data in Queue List </p>
        </div>
      )}
    </>
  );
}
