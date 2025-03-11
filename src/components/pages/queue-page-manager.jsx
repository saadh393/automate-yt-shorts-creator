import getQueueList from "@/api/get-queue-list";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import renderQueueList from "@/api/render-queue-list";
import { Progress } from "../ui/progress";
import { useSocket } from "@/hooks/use-socket";
import { Loader, X } from "lucide-react";
import stopRendering from "@/api/stopRendering";

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
  const { isConnected, renderStatus, connect, isRendering } = useSocket();

  async function refreshPage() {
    try {
      const data = await getQueueList();
      setQueueList(
        data.map((d, i) => {
          let title = d.split("data-")[1].split(".json")[0].trim();

          // Uppercase first letter
          let utitle = title.charAt(0).toUpperCase() + title.slice(1);
          const id = title.replace(/\s+/g, "_");
          console.log(id);
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

  return (
    <>
      <div className="text-sm text-gray-500">
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
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          onClick={startRendering}
          className="text-right block  mr-0 flex gap-2 items-center justify-center"
          variant="secondary"
          disabled={isRendering}
        >
          {/* if isRendering show spninner */}
          {isRendering && <Loader className="animate-spin h-4 w-4 " />}
          {isRendering ? "Rendering..." : "Start Rendering"}
        </Button>
      </div>
      <ul className="mt-2 space-y-2 divide-y ">
        {queueList.map((item) => (
          <li key={item.id} className="pt-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.title}</span>
              <span className="text-sm text-gray-500">{item.fileName}</span>
            </div>

            {renderStatus[item.id] && (
              <div className="mt-2">
                {renderStatus[item.id].status === StatusType.PROGRESS && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>Rendering...</span>
                      <span>{renderStatus[item.id].message}%</span>
                    </div>
                    <Progress value={renderStatus[item.id].message} />
                  </div>
                )}

                {renderStatus[item.id].status === StatusType.COMPLETE && (
                  <div className="text-green-500 text-sm">✅ {renderStatus[item.id].message}</div>
                )}

                {renderStatus[item.id].status === StatusType.ERROR && (
                  <div className="text-red-500 text-sm">Error: {renderStatus[item.id].message}</div>
                )}

                {console.log(restofTheStatus.includes(renderStatus[item.id].status))}

                {restofTheStatus.includes(renderStatus[item.id].status) && (
                  <div className="text-gray-500 text-sm">{renderStatus[item.id].message}</div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
