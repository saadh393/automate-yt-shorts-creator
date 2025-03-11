import ffmpeg from "fluent-ffmpeg";
import path from "path";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";

const AUDIO_FREQUENCY = 16000;
const AUDIO_CODEC = "pcm_s16le";

export default async function ffmpegAudioConverter(jsonObject, temp_folder) {
  const audio = path.join(temp_folder, jsonObject.data.audio);
  const extension = path.extname(audio);
  const outputPath = path.join(temp_folder, `output_${jsonObject.data.audio.replace(extension, ".wav")}`);

  console.log(audio);
  return new Promise((resolve, reject) => {
    updateProgress(jsonObject.data.audio, StatusType.FFMPEG, "Converting the audio to support 16bit wav");

    ffmpeg(audio)
      .audioFrequency(AUDIO_FREQUENCY)
      .audioChannels(1)
      .audioCodec(AUDIO_CODEC)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("progress", function (progress) {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on("error", (err) => {
        updateProgress(jsonObject.data.audio, StatusType.ERROR, `Error from FFMPEG : ${err}`);
        console.error("Error converting audio:", err);
        reject(err);
      })
      .save(outputPath);
  });
}
