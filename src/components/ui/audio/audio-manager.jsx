import RenderedVideo from "@/components/audio/rendered-video";
import SingleAudioCard from "@/components/audio/single-audio-card";
import UploadButton from "@/components/audio/upload-button";
import { useApp } from "@/context/app-provider";

export default function AudioManager() {
  const { renderedVideo } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"></div>
      <SingleAudioCard />
      <UploadButton />

      {/* This will apear when video rendered */}
      {renderedVideo && <RenderedVideo />}
    </div>
  );
}
