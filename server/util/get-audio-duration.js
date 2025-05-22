import ffmpeg from "fluent-ffmpeg";
import path from "path";

export default function getAudioDurationInMs(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const durationInMs = metadata.format.duration * 1000; // Convert seconds to milliseconds
        resolve(durationInMs);
      }
    });
  });
}
