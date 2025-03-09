import ffmpeg from "fluent-ffmpeg";
import path from "path";

const AUDIO_FREQUENCY = 16000;
const AUDIO_CODEC = "pcm_s16le";

export default async function ffmpegAudioConverter(jsonObject, temp_folder) {
  const audio = path.join(temp_folder, jsonObject.data.audio);
  const outputPath = path.join(temp_folder, `output_${jsonObject.data.audio}`);

  return new Promise((resolve, reject) => {
    ffmpeg(audio)
      .audioFrequency(AUDIO_FREQUENCY)
      .audioChannels(1)
      .audioCodec(AUDIO_CODEC)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("Error converting audio:", err);
        reject(err);
      })
      .save(outputPath);
  });
}
