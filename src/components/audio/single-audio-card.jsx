import { useApp } from "@/context/app-provider";
import { AudioUpload } from "../ui/audio-upload";
import { useEffect } from "react";

export default function SingleAudioCard() {
  const { setAudioFile, setUploadId, setConfig } = useApp();

  useEffect(() => {
    setUploadId(null);
    setConfig((pre) => {
      return { ...pre, audio: "upload" };
    });
  }, []);

  return (
    <div>
      <AudioUpload onAudioSelect={setAudioFile} setUploadId={setUploadId} />
    </div>
  );
}
