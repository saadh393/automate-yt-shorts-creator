import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-provider";
import { ROUTES } from "@/lib/constants";
import { AudioUpload } from "../audio-upload";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function AudioManager() {
  const { toast } = useToast();
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
    generateUploadId,
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

  const handleUpload = async (isQueueUpload = false) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setRenderedVideo(null);

      const formData = new FormData();
      const uploadId = generateUploadId();
      formData.append("uploadId", uploadId);

      // Convert all images to blobs and wait for them to complete
      const imagePromises = selectedImages.map(async (image, index) => {
        const response = await fetch(image.url);
        const blob = await response.blob();
        return { blob, index };
      });

      const imageBlobs = await Promise.all(imagePromises);

      // Add images to formData
      imageBlobs.forEach(({ blob, index }) => {
        formData.append("images", blob, `image-${index}.png`);
      });

      // Add audio files to formData
      if (isMultipleAudio) {
        multipleAudioFiles.forEach((file, index) => {
          if (file) {
            formData.append("audio", file);
          }
        });
      } else if (audioFile) {
        formData.append("audio", audioFile);
      }

      formData.append("isMultipleAudio", isMultipleAudio);
      formData.append("isQueueUpload", isQueueUpload);

      // Upload files using proxy
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      // Show success message
      toast({
        title: data.message,
        description: isQueueUpload
          ? "Your files have been queued successfully. You can queue more or generate videos."
          : "Your video has been generated successfully. Redirecting to preview...",
        variant: "success",
      });

      if (!isQueueUpload && data.videoUrl) {
        setRenderedVideo(data.videoUrl);
        setRoute(ROUTES.PREVIEW);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
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
      <Toaster />
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
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleUpload}
                disabled={
                  uploading ||
                  multipleAudioFiles.length !== selectedImages.length ||
                  selectedImages.length === 0
                }
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

              <Button
                variant="outline"
                onClick={() => handleUpload(true)}
                disabled={
                  uploading ||
                  multipleAudioFiles.length !== selectedImages.length ||
                  selectedImages.length === 0
                }
              >
                Queue New Upload
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <AudioUpload onAudioSelect={setAudioFile} />
          <div className="mt-6 flex gap-4 justify-center">
            <Button onClick={() => handleUpload(false)} disabled={uploading || !audioFile}>
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
            <Button variant="outline" disabled={uploading || !audioFile}>
              Queue New Upload
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
