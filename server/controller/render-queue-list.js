import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  DATA_DIR,
  getOutputVideoPath,
  REMOTION_INDEX,
} from "../config/paths.js";
import fs from "fs/promises";
import path from "path";

export default async function renderQueueListController() {
  // Sccan data folder to .json files
  const files = await fs.readdir(DATA_DIR);

  //   Read all the data.json files and store in array
  const data = await Promise.all(
    files.map(async (file) => {
      const dataPath = path.join(DATA_DIR, file);
      const data = await fs.readFile(dataPath, "utf-8");
      return JSON.parse(data);
    })
  );

  data.map(async (d, index) => {
    const response = await renderVideo(d, index);
    console.log(response);
  });
}

async function renderVideo(inputProps, uploadId) {
  try {
    // Bundle the video project
    const bundled = await bundle(REMOTION_INDEX);

    console.log(inputProps);

    // Select the composition
    const composition = await selectComposition({
      serveUrl: bundled,
      id: "single-audio",
      inputProps: inputProps,
    });

    // Render the video
    const outputPath = getOutputVideoPath(uploadId);
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: inputProps,
      onProgress: ({ progress }) => {
        // Convert progress from 0-1 to percentage
        const percentage = Math.floor(progress * 100);
        console.log(`Rendering progress for video ${uploadId}: ${percentage}%`);
        // If you have WebSocket set up, you can emit progress
        // global.io.emit('renderProgress', { uploadId, progress: percentage });
      },
    });

    return outputPath;
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}
