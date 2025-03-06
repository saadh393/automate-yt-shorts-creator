import { useApp } from "@/context/app-provider";
import { ImageGrid } from "./ui/images/image-grid";
import { Button } from "./ui/button";
import { ROUTES } from "@/lib/constants";

export const ImageGenerationStep = () => {
  const { generating, images, selectedImages, setRoute } = useApp();

  if (generating) {
    return (
      <div className="grid place-items-center">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 h-3/6">
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
      <div className="py-3 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-muted-foreground">
          Generated Images
        </h3>
       
      </div>

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
