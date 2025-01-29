import { useApp } from "@/context/app-provider";
import PartitionManager from "../ui/partition-manager";
import { ImageGenerationStep } from "../image-generation-step";
import SelectedImages from "../ui/images/selected-images";
import { ROUTES } from "@/lib/constants";
import ImageGenerate from "../image-generate";
import AudioManager from "../ui/audio/audio-manager";

export default function Home() {
  const { selectedImages, route } = useApp();

  if (route === ROUTES.HOME) {
    return (
      <PartitionManager selectedImages={selectedImages}>
        <ImageGenerationStep />
        <SelectedImages />
      </PartitionManager>
    );
  }

  if (route === ROUTES.AUDIO) {
    return <AudioManager />;
  }
}
