import createTempFile from "./create-temp.js";

/**
 * @param {Object} jsonObject - The object that contains the data for video rendering
 * @param {Object} jsonObject.data - The data object
 * @param {string[]} jsonObject.data.images - The array of image paths
 * @param {string} jsonObject.data.audio - The path to the audio file
 * @param {number} jsonObject.data.duration - The duration of the video in ms
 */
async function renderVideo(jsonObject) {
  await createTempFile(jsonObject);
}

export default renderVideo;

// Workflow
// - Move Audio and Images to /public/temp directory
// - convert the audio using ffmpeg to 16 bit output
// - Generate Subtitle from Audio
// - Convert the subtitle to remotion friendly srt
// - Pass it to remotion and wait for render complete
// - Clean up temp files and data.json
