import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-provider";
import { Loader } from "lucide-react";

export default function UploadButton() {
  const { uploading, uploadProgress, audioFile, uploadToServer } = useApp();

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <Button onClick={() => uploadToServer({ isQueueUpload: false })} disabled={uploading || !audioFile}>
        {uploading ? (
          <div className="flex items-center space-x-2">
            <span>{uploadProgress < 100 ? `Processing... ${uploadProgress}%` : "Finalizing..."}</span>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          "Upload Audio and Generate Video"
        )}
      </Button>
      <Button variant="outline" onClick={() => uploadToServer({ isQueueUpload: true })}>
        {uploading && <Loader className="animate-spin h-4 w-4 " />}
        Queue New Upload
      </Button>
    </div>
  );
}
