import { useApp } from "@/context/app-provider";
import { AudioUpload } from "../ui/audio-upload";

export default function SingleAudioCard() {
  const { setAudioFile } = useApp();
  return (
    <div>
      <AudioUpload onAudioSelect={setAudioFile} />
    </div>
  );
}
