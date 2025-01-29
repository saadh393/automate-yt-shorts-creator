import { useApp } from "@/context/app-provider";
import { useState } from "react";

export const TinyImage = ({ image }) => {
  const { handleSelectImage } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="relative cursor-pointer rounded-lg overflow-hidden ring ring-white"
      onClick={() => handleSelectImage(image)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      <img
        src={image.url}
        alt={image.prompt}
        className="w-full h-auto max-w-28 object-none"
        onLoad={() => setIsLoading(false)}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};
