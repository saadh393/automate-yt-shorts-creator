import getQueueList from "@/api/get-queue-list";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import renderQueueList from "@/api/render-queue-list";
import { Progress } from "../ui/progress";
import { useSocket } from "@/hooks/use-socket";
import { Loader, X } from "lucide-react";

export default function QueuePageManager() {
  const [queueList, setQueueList] = useState([]);
  const { toast } = useToast();
  const { isConnected, renderStatus } = useSocket();

  async function refreshPage() {
    try {
      const data = await getQueueList();

      setQueueList(
        data.map((d, i) => {
          let title = d.split("data-")[1].split(".json")[0].trim();

          // Uppercase first letter
          let utitle = title.charAt(0).toUpperCase() + title.slice(1);
          return { fileName: d, title : utitle, id : title  };
        })
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch queue   list. Please try again.",
      });
    }
  }

  async function startRendering() {
    try {
      await renderQueueList();
      toast({
        title: "Success",
        description: "Rendering started successfully",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start rendering. Please try again.",
      });
    }
  }

  useEffect(() => {
    refreshPage();
  }, []);

  function stopRendering() {
   // Todo: Implement stop rendering
  }


  const isRendering = Object.getOwnPropertyNames(renderStatus).length > 0;


  return (
    <>
    <div className="text-sm text-gray-500">
          {isConnected ? 
            <span className="text-green-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
              Connected to server
            </span> : 
            <span className="text-red-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
              Disconnected
            </span>
          }
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

      { <Button
        onClick={stopRendering}
        className="text-right   flex gap-2 items-center justify-center"
        variant="destructive"
      >
        <X className="h-4 w-4 " />
       Stop
      </Button>}
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
                {renderStatus[item.id].status === 'rendering' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>Rendering...</span>
                      <span>{renderStatus[item.id].progress}%</span>
                    </div>
                    <Progress value={renderStatus[item.id].progress} />
                  </div>
                )}
                
                {renderStatus[item.id].status === 'completed' && (
                  <div className="text-green-500 text-sm">Completed</div>
                )}
                
                {renderStatus[item.id].status === 'error' && (
                  <div className="text-red-500 text-sm">
                    Error: {renderStatus[item.id].error}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
