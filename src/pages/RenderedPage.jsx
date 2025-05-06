import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function RenderedPage() {
  const [data, setData] = useState([]);

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
        return "bg-amber-800";
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
      <Button onClick={handleStartProcessing}>Start Processing</Button>

      <div className="mt-4">
        {data.map((item, index) => (
          <div key={index} className={`p-4 mb-2 text-white ${getStatusColor(item.Upload)}`}>
            {item.Title} - {item.Upload}
          </div>
        ))}
      </div>
    </div>
  );
}
