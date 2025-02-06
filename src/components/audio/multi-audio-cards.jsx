import { useApp } from "@/context/app-provider";
import { AudioUpload } from "../ui/audio-upload";

export default function MultiAudioCards() {
  const { selectedImages, multipleAudioFiles, setMultipleAudioFiles } =
    useApp();

  const handleAudioSelect = (file, imageIndex) => {
    if (isMultipleAudio) {
      setMultipleAudioFiles((prev) => {
        const newFiles = [...prev];
        newFiles[imageIndex] = file;
        return newFiles;
      });
    }
  };

  return (
    <>
      <div className="space-y-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedImages.map((image, index) => (
            <div key={image.seed} className="p-4 border rounded-lg">
              <img
                src={image.url}
                alt={`Selected image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <div className="space-y-2">
                <p className="font-medium">Audio for Image {index + 1}</p>
                <AudioUpload
                  onAudioSelect={(file) => handleAudioSelect(file, index)}
                  audioFile={multipleAudioFiles[index]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
