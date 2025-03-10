import { UPLOADS_DIR } from "../../config/paths.js";
import formating_output from "./formating-output.js";
import ffmpegAudioConverter from "./ffmpeg-convert.js";
import generate_subtitle from "./generate-subtitle.js";
import process_video from "./process-video.js";

/**
 * An array of caption objects generated from the audio.
 * Each caption object contains the following properties:
 * @typedef {Object} Caption
 * @property {string} text - The text of the caption.
 * @property {number} startMs - The start time of the caption in milliseconds.
 * @property {number} endMs - The end time of the caption in milliseconds.
 * @property {number} timestampMs - The timestamp of the caption in milliseconds.
 * @property {number} confidence - The confidence score of the caption.
 *
 * @type {Caption[]}
 */

/**
 * @param {Object} jsonObject - The object that contains the data for video rendering
 * @param {Object} jsonObject.data - The data object
 * @param {string[]} jsonObject.data.images - The array of image paths
 * @param {string} jsonObject.data.audio - The path to the audio file
 * @param {number} jsonObject.data.duration - The duration of the video in ms
 */

async function renderVideo(jsonObject) {
  // Convert audio to 16 bit using ffmpeg
  const convertedAudioPath = await ffmpegAudioConverter(jsonObject, UPLOADS_DIR);

  /** @type Caption */
  const captionArray = await generate_subtitle(convertedAudioPath);
  jsonObject.data.caption = captionArray;

  // Render Video
  const { outputPath } = await process_video(jsonObject);

  // Folderize all the files
  await formating_output(jsonObject, outputPath);
}

export default renderVideo;
