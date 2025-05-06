import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Page } from "./Page";

const SubtitlePage = ({ page, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 5,
  });

  return (
    <AbsoluteFill>
      <Page enterProgress={enter} page={page} color={color} />
    </AbsoluteFill>
  );
};

export default SubtitlePage;
