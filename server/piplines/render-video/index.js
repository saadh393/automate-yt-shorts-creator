import { UPLOADS_DIR } from "../../config/paths.js";
import formating_output from "./formating-output.js";
import ffmpegAudioConverter from "./ffmpeg-convert.js";
import generate_subtitle from "./generate-subtitle.js";
import process_video from "./process-video.js";
import Validation from "./validation.js";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";
import generate_audio from "./generate-audio.js";

/**
 * @param {DataContent} jsonObject
 */

async function renderVideo(jsonObject) {
  // Checks if all the files exists in it's own place or not
  await Validation(jsonObject, UPLOADS_DIR);

  if (jsonObject.data?.audioType == "generate") {
    // If Audio is not provided then generate from audio Prompt
    const { duration } = await generate_audio(jsonObject);

    delete jsonObject.data.audioPrompt;
    jsonObject.data.audio = jsonObject.data.uploadId + ".mp3";
    jsonObject.data.duration = duration;
  }

  // Convert the audio to 16 bit wav
  const convertedAudioPath = await ffmpegAudioConverter(jsonObject, UPLOADS_DIR);

  // Generate subtitle
  const captionArray = await generate_subtitle(convertedAudioPath, jsonObject);
  jsonObject.data.caption = captionArray;

  // Render Video
  const { outputPath } = await process_video(jsonObject);

  // Remove temp and folderize all the files
  await formating_output(jsonObject, outputPath);

  updateProgress(jsonObject.data.uploadId, StatusType.COMPLETE, "Completed");
}

export default renderVideo;
