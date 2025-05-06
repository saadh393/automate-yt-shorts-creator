import { UPLOADS_DIR } from "../../config/paths.js";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";
import formating_output from "./formating-output.js";
import generate_audio from "./generate-audio.js";
import process_video from "./process-video.js";
import Validation from "./validation.js";

/**
 * @param {DataContent} jsonObject
 */

async function renderVideo(jsonObject) {
  // Checks if all the files exists in it's own place or not
  await Validation(jsonObject, UPLOADS_DIR);

  if (jsonObject.data?.audioType == "generate") {
    // If Audio is not provided then generate from audio Prompt
    
    // Capition is array of objects. Object looks like - { text: 'Octopuses',startMs: -5, endMs: 595,  timestampMs: 295, confidence: 1
  
    const {  duration, captions } = await generate_audio(jsonObject);
    console.log(captions)

    delete jsonObject.data.audioPrompt;
    jsonObject.data.audio = jsonObject.data.uploadId + ".mp3";
    jsonObject.data.duration = duration;
    jsonObject.data.caption = captions;
  }  

  

  // Render Video
  const { outputPath } = await process_video(jsonObject);

  // Remove temp and folderize all the files
  await formating_output(jsonObject, outputPath);

  updateProgress(jsonObject.data.uploadId, StatusType.COMPLETE, "Completed");
}

export default renderVideo;
