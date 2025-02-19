import { Composition } from "remotion";
import { SubtitleComposition } from "../compositions/SubtitleComposition";

export const SubtitleRoot = () => {

  return (
    <>
      <Composition
        id="subtitle"
        component={SubtitleComposition}
        defaultProps={{ data: "/uploads/TTSMaker File Feb 8 2025-4078.mp3" }}
        durationInFrames={30 * 10}
        fps={30}
        width={1920}
        height={1080}
      />
      
    </>
  );
};
