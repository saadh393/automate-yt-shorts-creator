import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { animations } from "../utils/animations";

export const MultiAudioComposition = ({ data }) => {
  if (!Array.isArray(data)) {
    return null;
  }

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let from = 0;
  const animKeys = Object.keys(animations);

  return (
    <AbsoluteFill>
      {data.map((obj, index) => {
        const start = from;
        const durationSeconds = obj.duration / 1000; // Convert milliseconds to seconds
        const end = from + durationSeconds * fps;
        from = end;

        const animIndex = index % animKeys.length;
        const animation = animations[animKeys[animIndex]](start, end, frame);
        return (
          <Sequence key={index} from={start} to={end}>
            <Img
              src={staticFile(`/uploads/${obj.image}`)}
              style={{
                width: "100%",
                height: "100%",
                ...animation,
              }}
            />
            <Audio src={staticFile(`/uploads/${obj.audio}`)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Add calculateMetadata to dynamically determine duration
export const calculateMetadata = ({ props }) => {
  const totalDurationMs = props.data.reduce(
    (sum, item) => sum + item.duration,
    0
  );
  const totalDurationSeconds = totalDurationMs / 1000;
  const fps = 30;
  return {
    durationInFrames: Math.ceil(totalDurationSeconds * fps),
    fps,
    width: 1080,
    height: 1920,
  };
};
