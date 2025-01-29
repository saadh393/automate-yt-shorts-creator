import { AudioUpload } from "./ui/audio-upload";
import { Button } from "./ui/button";

export const AudioUploadStep = ({
  uploading,
  uploadProgress,
  renderedVideo,
  onAudioSelect,
  onUpload,
  onBack,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Upload Audio</h2>
      <Button variant="outline" onClick={onBack}>
        Back to Images
      </Button>
    </div>

    <AudioUpload onAudioSelect={onAudioSelect} />

    <div className="mt-6 space-y-4">
      <Button onClick={onUpload} disabled={uploading} className="w-full">
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
          "Upload and Generate Video"
        )}
      </Button>

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
  </div>
);
