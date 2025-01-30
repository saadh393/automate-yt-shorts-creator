import { AbsoluteFill, Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
  calculateMetadata,
  MultiAudioComposition,
} from "./compositions/MultiAudioComposition";
import AudioComposition from "./compositions/AudioComposition";
import {
  calculateSingleCompositionMetadata,
  SingleAudioComposition,
} from "./compositions/SingleAudioComposition";

export const RemotionRoot = () => {
  const data = {
    images: [
      "images-1738215890909-799181728.png",
      "images-1738215890910-505443069.png",
      "4.jpeg",
      "5.jpeg",
      "6.jpeg",
    ],
    audio: "audio-1738215890913-136000804.wav",
    duration: 10,
  };

  const data2 = [
    {
      image: "images-1738215890910-505443069.png",
      audio: "audio-1738215890913-136000804.wav",
      duration: 5,
    },
    {
      image: "images-1738215890909-799181728.png",
      audio: "audio-1738215890913-136000804.wav",
      duration: 12,
    },
    {
      image: "4.jpeg",
      audio: "audio-1738215890913-136000804.wav",
      duration: 5,
    },
  ];

  let duration = 0;
  if (Array.isArray(data)) {
    duration = data.reduce((acc, curr) => {
      return acc + curr.duration;
    }, 0);
  } else {
    duration = data.duration;
  }

  console.log("duration");

  return (
    <>
      <Composition
        id="single-audio"
        component={SingleAudioComposition}
        defaultProps={{ data }}
        calculateMetadata={calculateSingleCompositionMetadata}
      />
      <Composition
        id="multiple-audio"
        component={MultiAudioComposition}
        defaultProps={{ data }}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
