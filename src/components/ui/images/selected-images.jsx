import { useApp } from "@/context/app-provider";
import { TinyImage } from "./tiny-image";

export default function SelectedImages() {
  const { selectedImages, onSelectImage, onNextStep } = useApp();

  if (selectedImages?.length === 0) return null;

  return (
    <>
      <div className="flex w-max space-x-4 p-4">
        {selectedImages.length > 0 &&
          selectedImages.map((image) => (
            <TinyImage key={image.url} image={image} />
          ))}
      </div>
    </>
  );
}

// return (<>
//     {selectedImages?.length > 0 && (<ImageGrid title="Selected Images"
//     images={selectedImages}
//     selectedImages={selectedImages}
//     onSelect={onSelectImage}
//     />
//     <div className="mt-8">
//     <Button onClick={onNextStep} className="ml-auto">
//         Next Step
//     </Button>
//     </div>
// )};
// </>)
