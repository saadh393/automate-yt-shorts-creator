import { useApp } from "@/context/app-provider";
import PartitionManager from "../ui/partition-manager";
import { ImageGenerationStep } from "../image-generation-step";
import SelectedImages from "../ui/images/selected-images";
import { ROUTES } from "@/lib/constants";
import ImageGenerate from "../image-generate";
import AudioManager from "../ui/audio/audio-manager";
import PromptField from "../ui/prompt-field";
import { useEffect } from "react";

export default function HomeManager() {
  const { selectedImages, setSelectedImages } = useApp();

  useEffect(() => {
    // Listen for Key event of ctrl + v
    const handlePaste = (e) => {
      if (e.ctrlKey && e.key === "v") {
        navigator.clipboard.readText().then((text) => {
          console.log(text)
          // const urls = text.split("\n");
          // const images = urls.map((url) => ({ url }));
          setSelectedImages({images : text});
        });
      }
    };

    // Add event listener
    document.addEventListener("keydown", handlePaste);

    // Remove event listener
    return () => {
      document.removeEventListener("keydown", handlePaste);
    }
  }, [selectedImages])

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
