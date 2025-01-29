import { ImageGrid } from "./image-grid";
import { Button } from "./ui/button";
import PromptField from "./ui/prompt-field";

export const ImageGenerationStep = ({
  images,
  selectedImages,
  generating,
  onGenerate,
  onSelectImage,
  onNextStep,
}) => (
  <>
    <PromptField onSubmit={onGenerate} />

    {generating ? (
      <div className="grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      images.length > 0 && (
        <ImageGrid
          title="Generated Images"
          images={images}
          selectedImages={selectedImages}
          onSelect={onSelectImage}
        />
      )
    )}

    {selectedImages.length > 0 && (
      <>
        <ImageGrid
          title="Selected Images"
          images={selectedImages}
          selectedImages={selectedImages}
          onSelect={onSelectImage}
        />
        <div className="mt-8">
          <Button onClick={onNextStep} className="ml-auto">
            Next Step
          </Button>
        </div>
      </>
    )}
  </>
);
