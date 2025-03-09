import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { animations } from "../utils/animations";
import { createTikTokStyleCaptions } from "@remotion/captions";
import SubtitlePage from "../caption/SubtitlePage";

const caption = [
  {
    text: "Did",
    startMs: 50,
    endMs: 230,
    timestampMs: 140,
    confidence: 0.722074,
  },
  {
    text: " you",
    startMs: 230,
    endMs: 420,
    timestampMs: 340,
    confidence: 0.996485,
  },
  {
    text: " know",
    startMs: 420,
    endMs: 730,
    timestampMs: 540,
    confidence: 0.994632,
  },
  {
    text: " coffee",
    startMs: 730,
    endMs: 1220,
    timestampMs: 1020,
    confidence: 0.81091,
  },
  {
    text: " can",
    startMs: 1220,
    endMs: 1340,
    timestampMs: 1300,
    confidence: 0.993013,
  },
  {
    text: " make",
    startMs: 1340,
    endMs: 1640,
    timestampMs: 1560,
    confidence: 0.991401,
  },
  {
    text: " your",
    startMs: 1640,
    endMs: 1900,
    timestampMs: 1760,
    confidence: 0.965362,
  },
  {
    text: " mind",
    startMs: 1900,
    endMs: 2240,
    timestampMs: 2120,
    confidence: 0.979324,
  },
  {
    text: " so",
    startMs: 2240,
    endMs: 2590,
    timestampMs: 2420,
    confidence: 0.973528,
  },
  {
    text: " fast",
    startMs: 2590,
    endMs: 3320,
    timestampMs: 2960,
    confidence: 0.996951,
  },
  {
    text: "?",
    startMs: 3320,
    endMs: 3320,
    timestampMs: 3240,
    confidence: 0.716501,
  },
  {
    text: " You",
    startMs: 3320,
    endMs: 3510,
    timestampMs: 3420,
    confidence: 0.993214,
  },
  {
    text: " can",
    startMs: 3510,
    endMs: 3710,
    timestampMs: 3600,
    confidence: 0.997725,
  },
  {
    text: " predict",
    startMs: 3710,
    endMs: 4070,
    timestampMs: 3880,
    confidence: 0.999012,
  },
  {
    text: " the",
    startMs: 4070,
    endMs: 4230,
    timestampMs: 4160,
    confidence: 0.997992,
  },
  {
    text: " future",
    startMs: 4230,
    endMs: 4570,
    timestampMs: 4540,
    confidence: 0.999493,
  },
  {
    text: ".",
    startMs: 4570,
    endMs: 4760,
    timestampMs: 4740,
    confidence: 0.859168,
  },
];

const { pages } = createTikTokStyleCaptions({
  combineTokensWithinMilliseconds: 200,
  captions: caption,
});

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
