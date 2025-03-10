import path from "path";
import { getOutputVideoPath, OUTPUT_DIR, SRC_DIR } from "../../config/paths.js";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const REMOTION_INDEX_FILE = path.join(SRC_DIR, "remotion/index.js");
const COMPOSITION_INDEX = "single-audio";
const VIDEO_CODEC = "h264";

/**
 * @param {Object} jsonObject - The object that contains the data for video rendering
 * @param {Object} jsonObject.data - The data object
 * @param {string[]} jsonObject.data.images - The array of image paths
 * @param {string} jsonObject.data.audio - The path to the audio file
 * @param {number} jsonObject.data.duration - The duration of the video in ms
 */
export default async function process_video(jsonObject) {
  const OUTPUT_FILE_NAME = jsonObject.data.audio.split(".")[0];
  const OUTPUT_FILE_PATH = getOutputVideoPath(OUTPUT_FILE_NAME);

  // Configuring Remotion
  const bundled = await bundle(REMOTION_INDEX_FILE);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: COMPOSITION_INDEX,
    inputProps: jsonObject,
  });

  // Rendering The Media
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: VIDEO_CODEC,
    outputLocation: OUTPUT_FILE_PATH,
    inputProps: jsonObject,
    onProgress: handleProgress,
  });

  return {
    outputPath: OUTPUT_FILE_PATH,
  };
}

function handleProgress({ progress }) {
  const percentage = Math.floor(progress * 100);
  // global.oi.emit("renderProgress", {
  //   uploadId: OUTPUT_FILE_NAME,
  //   outputPath: percentage,
  // });
}
