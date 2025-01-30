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

  const { images, audio, duration } = data;

  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  let from = 0;
  console.log(durationInFrames);
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
