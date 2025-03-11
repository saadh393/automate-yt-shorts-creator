import RenderedVideo from "@/components/audio/rendered-video";
import SingleAudioCard from "@/components/audio/single-audio-card";
import UploadButton from "@/components/audio/upload-button";
import { useApp } from "@/context/app-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import AudioGeneration from "@/components/audio-generation";

export default function AudioManager() {
  /** @type {Config} config */
  const { renderedVideo, config } = useApp();

  return (
    <div className="space-y-6">
      <Tabs defaultValue={config.audio} className="w-full ">
        <TabsList className="mx-auto w-fit block">
          <TabsTrigger value="generate">Generate Audio</TabsTrigger>
          <TabsTrigger value="upload">Upload Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="p-4">
          <AudioGeneration />
        </TabsContent>
        <TabsContent value="upload" className="p-4">
          <SingleAudioCard />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between"></div>

      <UploadButton />

      {/* This will apear when video rendered */}
      {renderedVideo && <RenderedVideo />}
    </div>
  );
}
