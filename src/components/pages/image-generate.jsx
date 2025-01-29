import { useState } from "react";
import PromptField from "../ui/prompt-field";
import { ImageGrid } from "../ui/image-grid";
import { AudioUpload } from "../ui/audio-upload";
import { Button } from "../ui/button";

const STEPS = {
  IMAGE_GENERATION: "IMAGE_GENERATION",
  AUDIO_UPLOAD: "AUDIO_UPLOAD",
};

// Helper to create image URL with specific dimensions
const createImageUrl = (prompt, params, width, height) => {
  const encodedPrompt = encodeURIComponent(prompt);
  const queryParams = new URLSearchParams({
    ...params,
    width: width,
    height: height,
    nologo: params.nologo.toString(),
    enhance: params.enhance.toString(),
    safe: params.safe.toString(),
    private: params.private.toString(),
  });
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;
};

export default function ImageGenerate() {
  const [images, setImages] = useState([]); // Generated images
  const [selectedImages, setSelectedImages] = useState([]); // Selected images
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.IMAGE_GENERATION);

  const generateRandomSeed = () => Math.floor(Math.random() * 1000000);

  const handleGenerateImage = async ({ prompt, ...params }) => {
    try {
      setGenerating(true);
      // Generate 4 images with different seeds
      const newImages = await Promise.all(
        Array(4)
          .fill(null)
          .map(async () => {
            const uniqueSeed = generateRandomSeed();
            const baseParams = { ...params, seed: uniqueSeed };

            // Create preview (low-res) URL - 512px for faster loading
            const previewUrl = createImageUrl(prompt, baseParams, 350, 350);

            // Create high-res URL with original dimensions
            const highResUrl = createImageUrl(
              prompt,
              baseParams,
              params.width || 1024,
              params.height || 1024
            );

            return {
              url: previewUrl, // Use low-res for preview
              highResUrl, // Store high-res URL for later
              seed: uniqueSeed,
              prompt: prompt,
              config: baseParams,
            };
          })
      );

      setImages(newImages); // Update only the generated images
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((selected) => selected.url === image.url);
      if (isSelected) {
        return prev.filter((selected) => selected.url !== image.url);
      } else {
        return [...prev, image];
      }
    });
  };

  const handleNext = () => {
    setCurrentStep(STEPS.AUDIO_UPLOAD);
    setImages([]); // Clear the image grid
  };

  const handleAudioSelect = (file) => {
    setAudioFile(file);
  };

  const handleUpload = async () => {
    if (!selectedImages.length || !audioFile) {
      console.error("Please select both images and audio file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setRenderedVideo(null);

    try {
      // Create FormData and append files
      const formData = new FormData();

      // Download and append each image using high-res URLs
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        try {
          // Fetch the high-res version
          const response = await fetch(image.highResUrl);
          const blob = await response.blob();

          // Create a File object from the blob
          const file = new File([blob], `image-${i}.png`, {
            type: "image/png",
            lastModified: new Date().getTime(),
          });

          formData.append("images", file);

          // Update progress
          setUploadProgress(Math.round(((i + 1) / selectedImages.length) * 30));
        } catch (error) {
          console.error(`Error processing image ${i}:`, error);
        }
      }

      // Append audio file
      formData.append("audio", audioFile);
      setUploadProgress(40);

      // Upload to server
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      // Set the rendered video URL
      if (result.files.video) {
        setRenderedVideo(`http://localhost:5000${result.files.video}`);
      }

      // Reset states after successful upload
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {currentStep === STEPS.IMAGE_GENERATION ? (
          <>
            <PromptField onSubmit={handleGenerateImage} />

            {/* Display Generated Images */}
            {generating ? (
              <div className="grid place-items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Generated Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-lg overflow-hidden ${
                          selectedImages.some(
                            (selected) => selected.url === image.url
                          )
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleImageSelect(image)}
                      >
                        <img
                          src={image.url}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Display Selected Images */}
            {selectedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selected Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer rounded-lg overflow-hidden ring-2 ring-blue-500"
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image.url}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedImages.length > 0 && (
              <div className="mt-8">
                <Button onClick={handleNext} className="ml-auto">
                  Next Step
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upload Audio</h2>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(STEPS.IMAGE_GENERATION)}
              >
                Back to Images
              </Button>
            </div>
            <AudioUpload onAudioSelect={handleAudioSelect} />

            {audioFile && selectedImages.length > 0 && (
              <div className="mt-6 space-y-4">
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
                    "Upload and Generate Video"
                  )}
                </Button>

                {renderedVideo && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Generated Video
                    </h3>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
