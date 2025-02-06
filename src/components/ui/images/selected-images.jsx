import { useApp } from "@/context/app-provider";
import { TinyImage } from "./tiny-image";

export default function SelectedImages() {
  const { selectedImages, onSelectImage, onNextStep } = useApp();

  if (selectedImages?.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap justify-start items-center gap-4 p-4 col-span-2 bg-popover rounded-md w-full">
        {selectedImages.length > 0 &&
          selectedImages.map((image) => (
            <TinyImage key={image.url} image={image} />
          ))}
      </div>
    </>
  );
}
