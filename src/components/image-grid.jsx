import { ImageItem } from "./image-item";

export const ImageGrid = ({ images, selectedImages, onSelect, title }) => (
  <div className="space-y-4">
    {title && <h3 className="text-lg font-semibold">{title}</h3>}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <ImageItem
          key={index}
          image={image}
          isSelected={selectedImages.some(
            (selected) => selected.url === image.url
          )}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
);
