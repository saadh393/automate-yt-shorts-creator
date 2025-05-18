import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/use-socket";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function RenderedPage() {
  const [data, setData] = useState([]);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      case "DONE":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  const handleStartProcessing = async () => {
    try {
      const response = await fetch("/api/process-content-list", {
        method: "GET",
      });
      const result = await response.json();
    } catch (error) {
      console.error("Error starting processing:", error);
    }
  };

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
          disabled={isRendering || !data.length}
        >
          {isRendering && <Loader className="animate-spin h-4 w-4 " />}
          {isRendering ? "Processing..." : "Start Processing"}
        </Button>
      </div>
      <ul className="mt-2 space-y-2 divide-y ">
        {data.map((item, index) => (
          <li key={index} className="pt-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">
                {renderStatus[item.ID] && renderStatus[item.ID].status === "DONE" && (
                  <div className="text-green-500 text-xs">{renderStatus[item.ID].message}</div>
                )}
                {item.Title}
              </span>
              <span className="text-sm text-gray-500">{item.ID}</span>
            </div>
            {renderStatus[item.ID] && (
              <div>
                {renderStatus[item.ID].status === "PENDING" && (
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Processing...</span>
                      <span>{renderStatus[item.ID].message}%</span>
                    </div>
                    {/* You can add a Progress bar here if you have one */}
                  </div>
                )}
                {isRendering && renderStatus[item.ID].status === "failed" && (
                  <div className="text-red-500 text-sm">Error: {renderStatus[item.ID].message}</div>
                )}
                {isRendering && ["PENDING", "DONE"].includes(renderStatus[item.ID].status) && (
                  <div className="inline-flex items-center justify-center py-1 transition ease-out text-xs text-gray-400">
                    <span>{renderStatus[item.ID].message}</span>
                  </div>
                )}
              </div>
            )}
            {!renderStatus[item.ID] && <div className={`text-xs ${getStatusColor(item.Upload)}`}>{item.Upload}</div>}
          </li>
        ))}
      </ul>
      {data.length === 0 && (
        <div className="min-h-60 bg-neutral-900 grid place-items-center my-8 rounded-md">
          <p className="text-sm text-neutral-400 text-center">No Data in Rendered List </p>
        </div>
      )}
    </>
  );
}
