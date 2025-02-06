import getQueueList from "@/api/get-queue-list";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import renderQueueList from "@/api/render-queue-list";

export default function QueuePageManager() {
  const [queueList, setQueueList] = useState([]);
  const { toast } = useToast();

  async function refreshPage() {
    try {
      const data = await getQueueList();

      setQueueList(
        data.map((d) => {
          const [fileName, date, time] = d.split("_");

          return { fileName: fileName.replace(/\.[^/.]+$/, ""), date, time };
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

  return (
    <>
      <Button
        onClick={startRendering}
        className="text-right block ml-auto mr-0"
        variant="secondary"
      >
        Start Rendering
      </Button>
      <ul className="mt-2 space-y-2 divide-y ">
        {queueList.map((item) => (
          <li key={item.time} className=" p-2">
            {item.fileName} {item.date} {item.time}
          </li>
        ))}
      </ul>
    </>
  );
}
