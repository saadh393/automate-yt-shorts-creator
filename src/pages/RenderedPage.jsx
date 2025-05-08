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
        console.log(data);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-zinc-900/80";
      case "failed":
        return "bg-red-200";
      case "DONE":
        return "bg-green-900";
      default:
        return "bg-zinc-900";
    }
  };

  const handleStartProcessing = async () => {
    try {
      const response = await fetch("/api/process-content-list", {
        method: "GET",
      });
      const result = await response.json();
      console.log("Processing started:", result);
    } catch (error) {
      console.error("Error starting processing:", error);
    }
  };

  return (
    <div>
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

      <Button onClick={handleStartProcessing}>
        {isRendering && <Loader className="animate-spin h-4 w-4 " />}
        Start Processing
      </Button>

      <div className="mt-4">
        {data.map((item, index) => (
          <div key={index} className={`p-4 mb-2 text-white ${getStatusColor(item.Upload)}`}>
            {item.Title} - {item.Upload} - {renderStatus[item.ID]?.message}
          </div>
        ))}
      </div>
    </div>
  );
}
