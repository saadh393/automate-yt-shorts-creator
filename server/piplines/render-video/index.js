import path from "path";
import createTempFile from "./create-temp.js";
import ffmpegAudioConverter from "./ffmpeg-convert.js";
import { PUBLIC_DIR } from "../../config/paths.js";
import generate_subtitle from "./generate-subtitle.js";

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
  const temp_folder = path.join(PUBLIC_DIR, "temp");

  await createTempFile(jsonObject, temp_folder);

  // Convert audio to 16 bit using ffmpeg
  const convertedAudioPath = await ffmpegAudioConverter(jsonObject, temp_folder);

  /** @type Caption */
  const captionArray = await generate_subtitle(convertedAudioPath);
}

export default renderVideo;

// Workflow
// - Move Audio and Images to /public/temp directory
// - convert the audio using ffmpeg to 16 bit output
// - Generate Subtitle from Audio
// - Convert the subtitle to remotion friendly srt
// - Pass it to remotion and wait for render complete
// - Clean up temp files and data.json
