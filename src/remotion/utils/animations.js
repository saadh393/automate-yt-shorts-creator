import { interpolate } from "remotion";

export const animations = {
  "zoom-in": (start, end, frame) => {
    const scale = interpolate(frame, [start, end], [1, 1.1], {
      extrapolateRight: "clamp",
    });
    return { transform: `scale(${scale})` };
  },
  "zoom-out": (start, end, frame) => {
    const scale = interpolate(frame, [start, end], [1.15, 1], {
      extrapolateRight: "clamp",
    });
    return { transform: `scale(${scale})` };
  },
  "slide-top-to-bottom": (start, end, frame) => {
    const translateY = interpolate(frame, [start, end], [-100, 100], {
      extrapolateRight: "clamp",
    });
    return { transform: `translateY(${translateY}px) scale(1.15)` };
  },
};
