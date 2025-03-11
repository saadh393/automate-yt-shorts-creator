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
  /** Checks if all the files exists in it's own place or not */
  await Validation(jsonObject, UPLOADS_DIR);

  console.log("audioPrompt", jsonObject.data?.audioPrompt);
  if (jsonObject.data?.audioType != "generate") {
    // Convert audio to 16 bit using ffmpeg
    const convertedAudioPath = await ffmpegAudioConverter(jsonObject, UPLOADS_DIR);

    /** @type {Caption} */
    const captionArray = await generate_subtitle(convertedAudioPath, jsonObject);
    jsonObject.data.caption = captionArray;
  } else {
    await generate_audio(jsonObject);
  }

  // Render Video
  const { outputPath } = await process_video(jsonObject);

  // // Folderize all the files
  // await formating_output(jsonObject, outputPath);

  // updateProgress(jsonObject.data.uploadId, StatusType.COMPLETE, "Completed");
}

export default renderVideo;
