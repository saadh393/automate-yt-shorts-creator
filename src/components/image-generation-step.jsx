import { useApp } from "@/context/app-provider";
import { ImageGrid } from "./ui/images/image-grid";

export const ImageGenerationStep = () => {
  const { generating, images, selectedImages } = useApp();

  if (generating) {
    return (
      <div className="grid place-items-center">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!generating && images.length === 0) {
    return null;
  }

  return (
    <>
      {images.length > 0 && (
        <ImageGrid
          title="Generated Images"
          images={images}
          selectedImages={selectedImages}
        />
      )}
    </>
  );
};
