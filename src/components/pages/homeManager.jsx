import { ImageGenerationStep } from "@/components/home-page/image-generation-step";
import PromptField from "@/components/home-page/prompt-field";
import AudioManager from "@/components/ui/audio/audio-manager";
import SelectedImages from "@/components/ui/images/selected-images";

export default function HomeManager() {
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
