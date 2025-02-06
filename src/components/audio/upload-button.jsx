import { useApp } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function UploadButton() {
  const {
    uploading,
    uploadProgress,
    setUploading,
    setUploadProgress,
    isMultipleAudio,
    multipleAudioFiles,
    audioFile,
    selectedImages,
    setRenderedVideo,
    generateUploadId,
  } = useApp();
  const { toast } = useToast();

  const handleUpload = async (isQueueUpload = false) => {
    console.log("handleUpload");
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
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload Failed",
        description:
          error.message ||
          "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <Button
        onClick={() => handleUpload(false)}
        disabled={uploading || !audioFile}
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
      <Button
        variant="outline"
        onClick={() => handleUpload(true)}
        disabled={uploading || selectedImages.length === 0}
      >
        Queue New Upload
      </Button>
    </div>
  );
}
