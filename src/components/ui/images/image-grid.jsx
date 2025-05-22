import { ImageItem } from "@/components/image-item";
import { Button } from "../button";
import { useApp } from "@/context/app-provider";
import { ROUTES } from "@/lib/constants";

export const ImageGrid = ({ images, selectedImages, onSelect, title }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-around items-center min-h-[300px]">
        {images.map((image, index) => (
          <ImageItem
            key={index}
            image={image}
            isSelected={selectedImages.some(
              (selected) => selected.url === image.url
            )}
          />
        ))}
      </div>
    </div>
  );
};
