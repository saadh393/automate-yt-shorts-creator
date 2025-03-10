import { createTikTokStyleCaptions } from "@remotion/captions";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import SubtitlePage from "../caption/SubtitlePage";
import { animations } from "../utils/animations";

// For single we will recive Object
export const SingleAudioComposition = ({ data }) => {
  if (Array.isArray(data)) {
    return <AbsoluteFill></AbsoluteFill>;
  }

  const { images, audio } = data;

  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  let from = 0;
  const eachDuration = durationInFrames / images.length;
  const animKeys = Object.keys(animations);

  const { pages } = createTikTokStyleCaptions({
    combineTokensWithinMilliseconds: 200,
    captions: data.caption,
  });

  return (
    <AbsoluteFill>
      {images.map((element, index) => {
        const start = from;
        const end = from + eachDuration;
        from = end;

        const animIndex = index % animKeys.length;
        const animation = animations[animKeys[animIndex]](start, end, frame);

        return (
          <Sequence key={index} from={start} to={end}>
            <Img
              src={staticFile(`/uploads/${element}`)}
              style={{
                width: "100%",
                height: "100%",
                ...animation,
              }}
            />
            {pages.map((page, index) => {
              const nextPage = pages[index + 1] ?? null;
              const subtitleStartFrame = (page.startMs / 1000) * fps;
              const subtitleEndFrame = Math.min(nextPage ? (nextPage.startMs / 1000) * fps : Infinity, subtitleStartFrame + 200);
              const durationInFrames = subtitleEndFrame - subtitleStartFrame;
              if (durationInFrames <= 0) {
                return null;
              }

              return (
                <Sequence key={index} from={subtitleStartFrame} durationInFrames={durationInFrames}>
                  <SubtitlePage key={index} page={page} />;
                </Sequence>
              );
            })}
          </Sequence>
        );
      })}
      <Audio src={staticFile(`/uploads/${audio}`)} />
    </AbsoluteFill>
  );
};

export const calculateSingleCompositionMetadata = ({ props }) => {
  const totalDurationMs = props.data.duration;
  const totalDurationSeconds = totalDurationMs / 1000;
  const fps = 30;
  return {
    durationInFrames: Math.ceil(totalDurationSeconds * fps),
    fps,
    width: 1080,
    height: 1920,
  };
};
