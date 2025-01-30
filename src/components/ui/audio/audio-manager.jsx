import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-provider";
import { ROUTES } from "@/lib/constants";
import { AudioUpload } from "../audio-upload";

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
    multipleAudioFiles,
    setUploading,
    setUploadProgress,
    setRenderedVideo,
    audioFile,
  } = useApp();

  const handleAudioSelect = (file, imageIndex) => {
    if (isMultipleAudio) {
      setMultipleAudioFiles((prev) => {
        const newFiles = [...prev];
        newFiles[imageIndex] = file;
        return newFiles;
      });
    } else {
      setAudioFile(file);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      // Convert all images to blobs and wait for them to complete
      const imagePromises = selectedImages.map(async (image, index) => {
        const response = await fetch(image.url);
        const blob = await response.blob();
        return { blob, index };
      });

      // Wait for all image conversions to complete
      const imageBlobs = await Promise.all(imagePromises);

      // Add images in order
      imageBlobs.forEach(({ blob, index }) => {
        formData.append("images", blob, `file-${index}.png`);
      });

      // Add audio files based on mode
      if (isMultipleAudio) {
        // Filter out any null/undefined entries and add audio files in order
        multipleAudioFiles
          .filter(Boolean)
          .forEach((audioFile, index) => {
            formData.append(
              "audio",
              audioFile,
              `file-${index}${getFileExtension(audioFile.name)}`
            );
          });
      } else if (audioFile) {
        formData.append(
          "audio",
          audioFile,
          `audio${getFileExtension(audioFile.name)}`
        );
      }

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          'x-upload-type': isMultipleAudio ? 'multiple' : 'single'
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setRenderedVideo(data.video);
    } catch (error) {
      console.error("Upload error:", error);
      // You might want to show an error message to the user here
    } finally {
      setUploading(false);
    }
  };

  // Helper function to get file extension
  const getFileExtension = (filename) => {
    const ext = filename.split(".").pop();
    return ext ? `.${ext}` : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="multiple-audio"
            checked={isMultipleAudio}
            onCheckedChange={setIsMultipleAudio}
          />
          <Label htmlFor="multiple-audio">Upload Multiple Audio Files</Label>
        </div>
        <Button variant="outline" onClick={() => setRoute(ROUTES.HOME)}>
          Back to Images
        </Button>
      </div>

      {isMultipleAudio ? (
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

          <div className="">
            <div className="container max-w-7xl mx-auto">
              <Button
                onClick={handleUpload}
                disabled={
                  uploading ||
                  multipleAudioFiles.length !== selectedImages.length
                }
                className="w-full"
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <span>
                      {uploadProgress < 100
                        ? `Processing... ${uploadProgress}%`
                        : "Finalizing..."}
                    </span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  `Upload All Audio Files and Generate Video (${
                    multipleAudioFiles.filter(Boolean).length
                  }/${selectedImages.length})`
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <AudioUpload onAudioSelect={setAudioFile} />
          <div className="mt-6">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <span>
                    {uploadProgress < 100
                      ? `Processing... ${uploadProgress}%`
                      : "Finalizing..."}
                  </span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Upload Audio and Generate Video"
              )}
            </Button>
          </div>
        </div>
      )}

      {renderedVideo && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            src={renderedVideo}
          >
            Your browser does not support the video tag.
          </video>
          <div className="mt-4">
            <a
              href={renderedVideo}
              download
              className="text-blue-500 hover:text-blue-600"
            >
              Download Video
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
