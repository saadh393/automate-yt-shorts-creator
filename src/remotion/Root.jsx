import { useEffect } from "react";
import { Composition } from "remotion";
import { loadFont } from "./caption/load-font";
import { calculateSingleCompositionMetadata, SingleAudioComposition } from "./compositions/SingleAudioComposition";

export const RemotionRoot = () => {
  const data = {
    images: ["iNF-AI-SH-1001-3f1pg5.jpg", "iNF-AI-SH-1001-77qu39.jpg"],
    audioType: "generate",
    uploadId: "iNF-AI-SH-1001",
    audio: "iNF-AI-SH-1001.mp3",
    duration: 10392,
    caption: [
      {
        text: "Octopuses",
        startMs: 5,
        endMs: 595,
        timestampMs: 295,
        confidence: 1,
      },
      {
        text: " have",
        startMs: 595,
        endMs: 833,
        timestampMs: 714,
        confidence: 1,
      },
      {
        text: " three",
        startMs: 833,
        endMs: 1095,
        timestampMs: 964,
        confidence: 1,
      },
      {
        text: " hearts",
        startMs: 1095,
        endMs: 1620,
        timestampMs: 1358,
        confidence: 1,
      },
      {
        text: ",",
        startMs: 1620,
        endMs: 1695,
        timestampMs: 1658,
        confidence: 1,
      },
      {
        text: " and",
        startMs: 1695,
        endMs: 1833,
        timestampMs: 1764,
        confidence: 1,
      },
      {
        text: " two",
        startMs: 1833,
        endMs: 2095,
        timestampMs: 1964,
        confidence: 1,
      },
      {
        text: " stop",
        startMs: 2095,
        endMs: 2445,
        timestampMs: 2270,
        confidence: 1,
      },
      {
        text: " beating",
        startMs: 2445,
        endMs: 2733,
        timestampMs: 2589,
        confidence: 1,
      },
      {
        text: " when",
        startMs: 2733,
        endMs: 2858,
        timestampMs: 2796,
        confidence: 1,
      },
      {
        text: " they",
        startMs: 2858,
        endMs: 3008,
        timestampMs: 2933,
        confidence: 1,
      },
      {
        text: " swim",
        startMs: 3008,
        endMs: 3845,
        timestampMs: 3427,
        confidence: 1,
      },
      {
        text: ".",
        startMs: 3845,
        endMs: 4008,
        timestampMs: 3927,
        confidence: 1,
      },
      {
        text: " Their",
        startMs: 4008,
        endMs: 4195,
        timestampMs: 4102,
        confidence: 1,
      },
      {
        text: " blood",
        startMs: 4195,
        endMs: 4458,
        timestampMs: 4327,
        confidence: 1,
      },
      {
        text: " is",
        startMs: 4458,
        endMs: 4608,
        timestampMs: 4533,
        confidence: 1,
      },
      {
        text: " blue",
        startMs: 4608,
        endMs: 4895,
        timestampMs: 4752,
        confidence: 1,
      },
      {
        text: " due",
        startMs: 4895,
        endMs: 5070,
        timestampMs: 4983,
        confidence: 1,
      },
      {
        text: " to",
        startMs: 5070,
        endMs: 5195,
        timestampMs: 5133,
        confidence: 1,
      },
      {
        text: " high",
        startMs: 5195,
        endMs: 5445,
        timestampMs: 5320,
        confidence: 1,
      },
      {
        text: " copper",
        startMs: 5445,
        endMs: 5795,
        timestampMs: 5620,
        confidence: 1,
      },
      {
        text: " content",
        startMs: 5795,
        endMs: 6545,
        timestampMs: 6170,
        confidence: 1,
      },
      {
        text: ",",
        startMs: 6545,
        endMs: 6645,
        timestampMs: 6595,
        confidence: 1,
      },
      {
        text: " and",
        startMs: 6645,
        endMs: 6758,
        timestampMs: 6702,
        confidence: 1,
      },
      {
        text: " they",
        startMs: 6758,
        endMs: 6895,
        timestampMs: 6827,
        confidence: 1,
      },
      {
        text: " can",
        startMs: 6895,
        endMs: 7070,
        timestampMs: 6983,
        confidence: 1,
      },
      {
        text: " regrow",
        startMs: 7070,
        endMs: 7520,
        timestampMs: 7295,
        confidence: 1,
      },
      {
        text: " lost",
        startMs: 7520,
        endMs: 7908,
        timestampMs: 7714,
        confidence: 1,
      },
      {
        text: " arms",
        startMs: 7908,
        endMs: 8345,
        timestampMs: 8127,
        confidence: 1,
      },
      {
        text: " like",
        startMs: 8345,
        endMs: 8570,
        timestampMs: 8458,
        confidence: 1,
      },
      {
        text: " lizards",
        startMs: 8570,
        endMs: 8995,
        timestampMs: 8783,
        confidence: 1,
      },
      {
        text: " regrow",
        startMs: 8995,
        endMs: 9383,
        timestampMs: 9189,
        confidence: 1,
      },
      {
        text: "tails",
        startMs: 9383,
        endMs: 10345,
        timestampMs: 9864,
        confidence: 1,
      },
      {
        text: ".",
        startMs: 10345,
        endMs: 10545,
        timestampMs: 10445,
        confidence: 1,
      },
    ],
  };

  useEffect(() => {
    loadFont();
  }, []);

  return (
    <>
      <Composition
        id="single-audio"
        component={SingleAudioComposition}
        defaultProps={{ data }}
        calculateMetadata={calculateSingleCompositionMetadata}
      />
    </>
  );
};
