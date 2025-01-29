import { AudioUploadStep } from "@/components/audio-upload-step";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/app-provider";
import { ROUTES } from "@/lib/constants";

export default function AudioManager() {
  const { 
    uploading, 
    uploadProgress, 
    renderedVideo, 
    setAudioFile,
    setMultipleAudioFiles, 
    setRoute,
    selectedImages,
    isMultipleAudio,
    setIsMultipleAudio,
    multipleAudioFiles
  } = useApp();

  const handleAudioSelect = (file, imageIndex) => {
    if (isMultipleAudio) {
      setMultipleAudioFiles(prev => {
        const newFiles = [...prev];
        newFiles[imageIndex] = file;
        return newFiles;
      });
    } else {
      setAudioFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="multiple-audio"
          checked={isMultipleAudio}
          onCheckedChange={setIsMultipleAudio}
        />
        <Label htmlFor="multiple-audio">Upload Multiple Audio Files</Label>
      </div>

      {isMultipleAudio ? (
        <div className="space-y-4">
          {selectedImages.map((image, index) => (
            <div key={image.seed} className="p-4 border rounded-lg">
              <img
                src={image.url}
                alt={`Selected image ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
              <AudioUploadStep
                uploading={uploading}
                uploadProgress={uploadProgress}
                renderedVideo={renderedVideo}
                onAudioSelect={(file) => handleAudioSelect(file, index)}
                onUpload={() => {}}
                audioFile={multipleAudioFiles[index]}
                label={`Upload Audio for Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <AudioUploadStep
          uploading={uploading}
          uploadProgress={uploadProgress}
          renderedVideo={renderedVideo}
          onAudioSelect={setAudioFile}
          onUpload={() => {}}
          onBack={() => setRoute(ROUTES.HOME)}
        />
      )}
    </div>
  );
}
