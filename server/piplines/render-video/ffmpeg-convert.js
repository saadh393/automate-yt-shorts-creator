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
    updateProgress(jsonObject.data.audio, StatusType.FFMPEG, "⛏️ Preparing FFMPEG...");

    ffmpeg(audio)
      .audioFrequency(AUDIO_FREQUENCY)
      .audioChannels(1)
      .audioCodec(AUDIO_CODEC)
      .on("end", () => {
        updateProgress(jsonObject.data.audio, StatusType.FFMPEG, "Audio Converted Successfully");
        resolve(outputPath);
      })
      .on("progress", function (progress) {
        updateProgress(jsonObject.data.audio, StatusType.FFMPEG, "Audio Converting to 16bit");
      })
      .on("error", (err) => {
        updateProgress(jsonObject.data.audio, StatusType.ERROR, `Error from FFMPEG : ${err}`);
        console.error("Error converting audio:", err);
        reject(err);
      })
      .save(outputPath);
  });
}
