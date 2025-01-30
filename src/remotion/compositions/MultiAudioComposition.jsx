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
  const { fps, width, height, durationInFrames } = useVideoConfig();

  let from = 0;
  const animKeys = Object.keys(animations);

  return (
    <AbsoluteFill>
      {data.map((obj, index) => {
        const start = from;
        const end = from + obj.duration * fps;
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
