import { useApp } from "@/context/app-provider";
import { useEffect } from "react";
import PromptField from "@/components/home-page/prompt-field";
import { ImageGenerationStep } from "@/components/home-page/image-generation-step";
import AudioManager from "@/components/ui/audio/audio-manager";
import SelectedImages from "@/components/ui/images/selected-images";

export default function HomeManager() {
  const { selectedImages, setSelectedImages } = useApp();

  useEffect(() => {
    // Listen for Key event of ctrl + v
    const handlePaste = (e) => {
      if (e.ctrlKey && e.key === "v") {
        navigator.clipboard.readText().then((text) => {
          console.log(text);
          setSelectedImages({ images: text });
        });
      }
    };

    // Add event listener
    document.addEventListener("keydown", handlePaste);

    // Remove event listener
    return () => {
      document.removeEventListener("keydown", handlePaste);
    };
  }, [selectedImages]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PromptField />
        <SelectedImages />
      </div>
      <ImageGenerationStep />
      <AudioManager />
    </>
  );
}
