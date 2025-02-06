import { useApp } from "@/context/app-provider";
import PartitionManager from "../ui/partition-manager";
import { ImageGenerationStep } from "../image-generation-step";
import SelectedImages from "../ui/images/selected-images";
import { ROUTES } from "@/lib/constants";
import ImageGenerate from "../image-generate";
import AudioManager from "../ui/audio/audio-manager";
import PromptField from "../ui/prompt-field";

export default function HomeManager() {
  const { selectedImages, route } = useApp();

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <PromptField />
        <SelectedImages />
      </div>
      <ImageGenerationStep />
      <AudioManager />
    </>
  );
}
