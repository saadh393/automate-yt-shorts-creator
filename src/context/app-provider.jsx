import fetchBlobFromServer from "@/api/featch-blob-from-server";
import uploadFilesApi from "@/api/upload-queue-files";
import prepareApiCall from "@/lib/prepare-api-call";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AppContext = createContext();

/** @type {Config} defaultConfig */
const defaultConfig = {
  audio: "generate",
  model: "flux",
  width: 1080,
  height: 1920,
  seed: Math.floor(Math.random() * 1000000),
  nologo: true,
  enhance: true,
  safe: true,
  private: false,
  imageCount: 4,
};

/**
 *
 * @returns {Config} savedState
 */
const loadAppConfig = () => {
  const savedState = localStorage.getItem("config");
  return savedState ? JSON.parse(savedState) : defaultConfig;
};

const saveAppConfig = (state) => {
  localStorage.setItem("config", JSON.stringify(state));
};

export default function AppProvider({ children }) {
  /**
   * @type {[Config, React.Dispatch<React.SetStateAction<Config>>]}
   */
  const [config, setConfig] = useState(() => {
    const saved = loadAppConfig();
    return saved;
  });

  // Non-persisted state
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [audioText, setAudioText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploadId, setUploadId] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    saveAppConfig(config);
  }, [config]);

  const handleGenerateImage = async () => {
    setImages([]);
    prepareApiCall(prompt, config, 6)
      .then(setImages)
      .catch((error) => {
        console.error("Error generating images:", error);
        setError(error);
      });
  };

  function handleSelectImage(image) {
    setSelectedImages((prev) => {
      if (prev.some((prevImage) => prevImage.url === image.url)) {
        return prev.filter((prevImage) => prevImage.url !== image.url);
      } else {
        return [...prev, image];
      }
    });
  }

  async function uploadToServer({ isQueueUpload = false }) {
    setUploading(true);
    setRenderedVideo(null);

    const formData = new FormData();

    if (!selectedImages.length) {
      setUploading(false);
      return toast.error("Select Atleast one image file");
    }

    const audioContent = config.audio == "generate" ? audioText : audioFile;
    if (!audioContent) {
      setUploading(false);
      return toast.error("Audio is not provided Properly");
    }

    // Convert all images to blobs and wait for them to complete
    const imagePromises = selectedImages.map(async (image, index) => {
      if (image.url.includes("image.pollinations.ai")) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        return { blob, index };
      } else {
        const blob = await fetchBlobFromServer(image.url);
        if (blob) {
          return { blob, index };
        }
        return null;
      }
    });

    // Add images to formData
    const imageBlobs = (await Promise.all(imagePromises)).filter(Boolean);
    imageBlobs.forEach(({ blob, index }) => {
      formData.append("images", blob, `image-${index}.png`); // @todo : uploadid
    });

    formData.append("audioType", config.audio);
    formData.append("audio", audioContent);
    formData.append("isQueueUpload", isQueueUpload);
    formData.append("uploadId", uploadId == null ? "" : uploadId);

    uploadFilesApi(formData)
      .then(() => {
        setSelectedImages([]);
        setAudioFile(null);
        setAudioText("");
        setPrompt("");
        setImages(null);
        setError(null);
        setUploadId(null);
        toast.success("Queued Successfully");
      })
      .catch((e) => {
        console.error(e);
        toast.error("There is an error, check console for stacktrace");
      })
      .finally(() => {
        setUploading(false);
      });
  }

  return (
    <AppContext.Provider
      value={{
        error,
        images,
        selectedImages,
        audioFile,

        uploading,
        uploadProgress,
        renderedVideo,
        generating,
        handleGenerateImage,
        handleSelectImage,

        setAudioFile,
        setUploading,
        setUploadProgress,
        setRenderedVideo,
        setSelectedImages,
        setGenerating,
        uploadId,
        config,
        setConfig,
        audioText,
        setAudioText,
        uploadToServer,
        setUploadId,
        uploadId,
        prompt,
        setPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
