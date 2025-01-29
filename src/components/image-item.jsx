export const ImageItem = ({ image, isSelected, onSelect }) => (
  <div
    className={`relative cursor-pointer rounded-lg overflow-hidden ${
      isSelected ? "ring-2 ring-blue-500" : ""
    }`}
    onClick={() => onSelect(image)}
  >
    <img src={image.url} alt={image.prompt} className="w-full h-auto" />
  </div>
);
