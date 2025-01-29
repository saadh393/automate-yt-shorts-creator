import { useState } from "react";
import { ImageGenerationStep } from "./image-generation-step";
import { AudioUploadStep } from "./audio-upload-step";
import { STEPS } from "@/lib/constants";
import { createImageUrl, generateRandomSeed } from "@/lib/image-utils";

export default function ImageGenerate() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.IMAGE_GENERATION);

  const handleGenerateImage = async ({ prompt, ...params }) => {
    try {
      setGenerating(true);
      const newImages = await Promise.all(
        Array(4)
          .fill(null)
          .map(async () => {
            const uniqueSeed = generateRandomSeed();
            const baseParams = { ...params, seed: uniqueSeed };
            return {
              url: createImageUrl(prompt, baseParams, 350, 350),
              highResUrl: createImageUrl(
                prompt,
                baseParams,
                params.width || 1024,
                params.height || 1024
              ),
              seed: uniqueSeed,
              prompt: prompt,
              config: baseParams,
            };
          })
      );
      setImages(newImages);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImages((prev) =>
      prev.some((selected) => selected.url === image.url)
        ? prev.filter((selected) => selected.url !== image.url)
        : [...prev, image]
    );
  };

  const handleUpload = async () => {
    if (!selectedImages.length || !audioFile) return;

    setUploading(true);
    setUploadProgress(0);
    setRenderedVideo(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < selectedImages.length; i++) {
        const response = await fetch(selectedImages[i].highResUrl);
        const blob = await response.blob();
        formData.append("images", new File([blob], `image-${i}.png`));
        setUploadProgress(Math.round(((i + 1) / selectedImages.length) * 30));
      }

      formData.append("audio", audioFile);
      setUploadProgress(40);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setRenderedVideo(`http://localhost:5000${result.files.video}`);
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {currentStep === STEPS.IMAGE_GENERATION ? (
          <ImageGenerationStep
            images={images}
            selectedImages={selectedImages}
            generating={generating}
            onGenerate={handleGenerateImage}
            onSelectImage={handleImageSelect}
            onNextStep={() => {
              setCurrentStep(STEPS.AUDIO_UPLOAD);
              setImages([]);
            }}
          />
        ) : (
          <AudioUploadStep
            uploading={uploading}
            uploadProgress={uploadProgress}
            renderedVideo={renderedVideo}
            onAudioSelect={setAudioFile}
            onUpload={handleUpload}
            onBack={() => setCurrentStep(STEPS.IMAGE_GENERATION)}
          />
        )}
      </div>
    </div>
  );
}
