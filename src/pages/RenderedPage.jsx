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
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <Button>Start Processing</Button>

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
