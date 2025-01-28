import { useState } from "react";
import PromptField from "../ui/prompt-field";
import { ImageGrid } from "../ui/image-grid";
import { AudioUpload } from "../ui/audio-upload";
import { Button } from "../ui/button";

const STEPS = {
  IMAGE_GENERATION: "IMAGE_GENERATION",
  AUDIO_UPLOAD: "AUDIO_UPLOAD",
};

export default function ImageGenerate() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.IMAGE_GENERATION);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState(null);

  const generateRandomSeed = () => Math.floor(Math.random() * 1000000);

  const handleGenerateImage = async (config) => {
    setLoading(true);
    setSelectedImages([]); // Clear selections when generating new images
    try {
      // Generate 12 images with different seeds
      const imagePromises = Array(12)
        .fill()
        .map(async (_, index) => {
          const { prompt, ...params } = config;
          const encodedPrompt = encodeURIComponent(prompt);

          // Create a new seed for each image
          const uniqueSeed = generateRandomSeed();
          
          // Convert boolean parameters to strings and add unique seed
          const queryParams = new URLSearchParams({
            ...params,
            seed: uniqueSeed,
            nologo: params.nologo.toString(),
            enhance: params.enhance.toString(),
            safe: params.safe.toString(),
            private: params.private.toString(),
          });

          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;
          return {
            url: imageUrl,
            seed: uniqueSeed,
            prompt: prompt,
            config: { ...params, seed: uniqueSeed }
          };
        });

      const newImages = await Promise.all(imagePromises);
      setImages(newImages);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (image) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((selected) => selected.seed === image.seed);
      if (isSelected) {
        return prev.filter((selected) => selected.seed !== image.seed);
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
      console.error('Please select both images and audio file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setRenderedVideo(null);

    try {
      // Create FormData and append files
      const formData = new FormData();
      
      // Download and append each image
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        try {
          const response = await fetch(image.url);
          const blob = await response.blob();
          
          // Create a File object from the blob
          const file = new File([blob], `image-${i}.png`, {
            type: 'image/png',
            lastModified: new Date().getTime()
          });
          
          formData.append('images', file);
          
          // Update progress
          setUploadProgress(Math.round((i + 1) / selectedImages.length * 30));
        } catch (error) {
          console.error(`Error processing image ${i}:`, error);
        }
      }

      // Append audio file
      formData.append('audio', audioFile);
      setUploadProgress(40);

      // Upload to server
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
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
      console.error('Upload error:', error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section>
        {currentStep === STEPS.IMAGE_GENERATION ? (
          <>
            <PromptField onSubmit={handleGenerateImage} />

            {selectedImages.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Selected Images ({selectedImages.length})
                  </h3>
                  <Button onClick={handleNext} className="ml-auto">
                    Next Step
                  </Button>
                </div>
                <ImageGrid
                  images={selectedImages}
                  selectedImages={selectedImages}
                  onToggleSelect={toggleImageSelection}
                  showRemoveButton
                />
              </div>
            )}

            <div className="mt-8">
              {loading ? (
                <div className="text-center">Generating images...</div>
              ) : (
                <ImageGrid
                  images={images}
                  selectedImages={selectedImages}
                  onToggleSelect={toggleImageSelection}
                />
              )}
            </div>
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
                          : 'Finalizing...'}
                      </span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    'Upload and Generate Video'
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
            )}
          </div>
        )}
      </section>
    </main>
  );
}
