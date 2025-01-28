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

export const MyComposition = ({ data }) => {
  const { images, audio, duration } = data;
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const animations = {
    "zoom-in": (start, end) => {
      const scale = interpolate(frame, [start, end], [1, 1.1], {
        extrapolateRight: "clamp",
      });
      return { transform: `scale(${scale})` };
    },
    "zoom-out": (start, end) => {
      const scale = interpolate(frame, [start, end], [1.15, 1], {
        extrapolateRight: "clamp",
      });
      return { transform: `scale(${scale})` };
    },
    "slide-top-to-bottom": (start, end) => {
      const translateY = interpolate(frame, [start, end], [-100, 100], {
        extrapolateRight: "clamp",
      });
      return { transform: `translateY(${translateY}px) scale(1.15)` };
    },
  };
  let from = 0;
  const eachDuration = (duration / images.length) * fps;

  return (
    <AbsoluteFill>
      {images.map((element, index) => {
        const start = from;
        const end = from + eachDuration;
        from = end;

        // Get Animation based on index
        const keys = Object.keys(animations);
        return (
          <Sequence key={index} from={start} to={end}>
            <Img
              src={staticFile(`/uploads/${element}`)}
              style={{
                width: "100%",
                height: "100%",
                ...animations[keys[index]](start, end),
              }}
            />
          </Sequence>
        );
      })}
      <Audio src={staticFile(`/uploads/${audio}`)} />
    </AbsoluteFill>
  );
};
