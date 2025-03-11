import { useState, useEffect } from "react";
import { ROUTES, STATE } from "@/lib/constants";
import prepareApiCall from "@/lib/prepare-api-call";
import { createContext } from "react";
import { useContext } from "react";
import { toast } from "sonner";
import uploadQueueFiles from "@/api/upload-queue-files";

const AppContext = createContext();

// Load saved state from localStorage
const loadSavedState = () => {
  const savedState = localStorage.getItem("appState");
  return savedState ? JSON.parse(savedState) : null;
};

// Save state to localStorage
const saveState = (state) => {
  localStorage.setItem("appState", JSON.stringify(state));
};

/** @type {Config} defaultConfig */
const defaultConfig = {
  audio: "generate",
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

  // Initialize all persisted state using lazy initialization
  const [state, setState] = useState(() => {
    const saved = loadSavedState();
    return saved?.state || STATE.IDLE;
  });

  const [route, setRoute] = useState(() => {
    const saved = loadSavedState();
    return saved?.route || ROUTES.HOME;
  });

  const [isMultipleAudio, setIsMultipleAudio] = useState(() => {
    const saved = loadSavedState();
    return saved?.isMultipleAudio || false;
  });

  // Non-persisted state
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [audioText, setAudioText] = useState(null);
  const [multipleAudioFiles, setMultipleAudioFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploadId, setUploadId] = useState(null);
  const [prompt, setPrompt] = useState("");

  const generateUploadId = () => {
    let dateTime = new Date().toLocaleString();
    dateTime = dateTime.replace(/:/g, "-").replace(/\//g, "-").replace(/ /g, "-").replace(/\,/g, "_");
    const generatedId = prompt.replace(/\s/g, "-") + "_" + dateTime;
    setUploadId(generatedId);
    return generatedId;
  };

  // Save state changes to localStorage
  useEffect(() => {
    const stateToSave = {
      state,
      route,
      isMultipleAudio,
    };
    saveState(stateToSave);
  }, [state, route, isMultipleAudio]);

  useEffect(() => {
    saveAppConfig(config);
  }, [config]);

  const handleGenerateImage = async ({ prompt, ...params }) => {
    setState(STATE.GENERATING);
    setImages([]);
    setPrompt(prompt);
    prepareApiCall(prompt, params, 6)
      .then(setImages)
      .finally(() => setState(STATE.SUCCESS))
      .catch((error) => {
        console.error("Error generating images:", error);
        setError(error);
        setState(STATE.FAILURE);
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

  async function queueRendering() {
    setUploading(true);
    setRenderedVideo(null);

    const formData = new FormData();

    if (!selectedImages.length) {
      setUploading(false);
      return toast.error("Select Atleast one image file");
    }

    const audioContent = config.audio == "generate" ? audioText : audioFile;
    console.log(audioContent, config.audio == "generate");
    if (!audioContent) {
      setUploading(false);
      return toast.error("Audio is not provided Properly");
    }

    // Convert all images to blobs and wait for them to complete
    const imagePromises = selectedImages.map(async (image, index) => {
      const response = await fetch(image.url);
      const blob = await response.blob();
      return { blob, index };
    });

    // Add images to formData
    const imageBlobs = await Promise.all(imagePromises);
    imageBlobs.forEach(({ blob, index }) => {
      formData.append("images", blob, `image-${index}.png`);
    });

    formData.append("audioType", config.audio);
    formData.append("audio", audioContent);
    formData.append("isQueueUpload", true);
    formData.append("uploadId", uploadId);

    uploadQueueFiles(formData)
      .then(() => {
        setSelectedImages([]);
        setAudioFile(null);
        setAudioText(null);
        setPrompt(null);
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
        route,
        state,
        error,
        images,
        selectedImages,
        audioFile,
        isMultipleAudio,
        setIsMultipleAudio,
        multipleAudioFiles,
        setMultipleAudioFiles,
        uploading,
        uploadProgress,
        renderedVideo,
        generating,
        handleGenerateImage,
        handleSelectImage,
        setRoute,
        setAudioFile,
        setUploading,
        setUploadProgress,
        setRenderedVideo,
        setSelectedImages,
        setGenerating,
        uploadId,
        generateUploadId,
        config,
        setConfig,
        audioText,
        setAudioText,
        queueRendering,
        setUploadId,
        uploadId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
