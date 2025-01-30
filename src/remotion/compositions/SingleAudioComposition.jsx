import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { animations } from "../utils/animations";

// For single we will recive Object
export const SingleAudioComposition = ({ data }) => {
  if (Array.isArray(data)) {
    return <AbsoluteFill></AbsoluteFill>;
  }

  const { images, audio } = data;

  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

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
