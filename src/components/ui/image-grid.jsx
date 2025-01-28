import { cn } from "@/lib/utils";

export function ImageGrid({ images, selectedImages, onToggleSelect, showRemoveButton = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => {
        const isSelected = selectedImages.some(
          (selected) => selected.seed === image.seed
        );
        return (
          <div
            key={image.seed}
            className={cn(
              "aspect-square rounded-lg overflow-hidden shadow-lg relative group cursor-pointer",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => onToggleSelect(image)}
          >
            <img
              src={image.url}
              alt={`Generated image with seed ${image.seed}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-4 text-white">
                <p className="text-sm">Seed: {image.seed}</p>
                {showRemoveButton ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(image);
                    }}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                ) : (
                  <p className="text-sm mt-1">
                    {isSelected ? "Click to Unselect" : "Click to Select"}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
