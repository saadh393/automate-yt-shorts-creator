import { AbsoluteFill, Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { MyComposition } from "./compositions/FirstComposition";
import AudioComposition from "./compositions/AudioComposition";

export const RemotionRoot = () => {
  const data = {
    images: ["image-1.png", "image-2.png", "image-3.png"],
    audio: "audio.wav",
    duration: 9.792,
  };

  return (
    <>
      <Composition
        id="DynamicComposition2"
        component={MyComposition}
        durationInFrames={Math.ceil(data.duration) * 30} // Adjust based on average duration
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ data }}
      />
    </>
  );
};
