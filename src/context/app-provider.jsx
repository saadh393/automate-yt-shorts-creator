import { useState, useEffect } from "react";
import { ROUTES, STATE } from "@/lib/constants";
import prepareApiCall from "@/lib/prepare-api-call";
import { createContext } from "react";
import { useContext } from "react";

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

export default function AppProvider({ children }) {
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
  const [multipleAudioFiles, setMultipleAudioFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploadId, setUploadId] = useState(null);

  const generateUploadId = () => {
    const randomId = Date.now().toString();
    setUploadId(randomId);
    return randomId;
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

  const handleGenerateImage = async ({ prompt, ...params }) => {
    setState(STATE.GENERATING);
    setRoute(ROUTES.HOME);
    setImages([]);
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

    console.log(selectedImages);
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
        setGenerating,
        uploadId,
        generateUploadId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * @typedef {Object} AppContextValue
 * @property {import('@/lib/constants').STATE} state - Current application state (IDLE, GENERATING, SUCCESS, FAILURE)
 * @property {Error|null} error - Error object if any error occurs during generation
 * @property {Array<Object>} images - Array of generated images
 * @property {boolean} generating - Flag indicating if image generation is in progress
 * @property {Array<Object>} selectedImages - Array of currently selected images
 * @property {(params: {prompt: string, [key: string]: any}) => Promise<void>} handleGenerateImage - Function to generate images based on prompt and additional parameters
 */

/**
 * Hook to access the App context values
 * @returns {AppContextValue} The current app context value
 * @throws {Error} If used outside of AppProvider
 */
export function useApp() {
  return useContext(AppContext);
}
