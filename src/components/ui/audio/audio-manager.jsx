import MultiAudioCards from "@/components/audio/multi-audio-cards";
import RenderedVideo from "@/components/audio/rendered-video";
import SingleAudioCard from "@/components/audio/single-audio-card";
import UploadButton from "@/components/audio/upload-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/app-provider";
import { ROUTES } from "@/lib/constants";

export default function AudioManager() {
  const {
    renderedVideo,
    setRoute,
    selectedImages,
    isMultipleAudio,
    setIsMultipleAudio,
    multipleAudioFiles,
    setUploading,
    setUploadProgress,
    setRenderedVideo,
    audioFile,
    generateUploadId,
  } = useApp();

  // Helper function to get file extension
  const getFileExtension = (filename) => {
    const ext = filename.split(".").pop();
    return ext ? `.${ext}` : "";
  };

  // if (selectedImages.length === 0) {
  //   return null;
  // }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center space-x-2">
          <Switch
            id="multiple-audio"
            checked={isMultipleAudio}
            onCheckedChange={setIsMultipleAudio}
          />
          <Label htmlFor="multiple-audio">Upload Multiple Audio Files</Label>
        </div> */}
      </div>

      {/* {isMultipleAudio ? <MultiAudioCards /> : <SingleAudioCard />} */}
      <SingleAudioCard />
      <UploadButton />

      {renderedVideo && <RenderedVideo />}
    </div>
  );
}
