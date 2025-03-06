import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  DATA_DIR,
  getOutputVideoPath,
  REMOTION_INDEX,
} from "../config/paths.js";
import fs from "fs/promises";
import path from "path";
import { EventEmitter } from "events";

// Increase EventEmitter limit to prevent warnings
EventEmitter.defaultMaxListeners = 50;

export default async function renderQueueListController() {
  // Scan data folder for .json files
  const files = await fs.readdir(DATA_DIR);

  // Read all the data.json files and store in array
  const data = await Promise.all(
    files.map(async (file) => {
      const dataPath = path.join(DATA_DIR, file);
      const data = await fs.readFile(dataPath, "utf-8");
      return JSON.parse(data);
    })
  );

  // Process videos sequentially using for...of loop instead of map
  for (let index = 0; index < data.length; index++) {
    const d = data[index];
    
    let file_name = "";
    if (d.data) {
      if (typeof d.data.audio == "string") {
        file_name += d.data.audio.split(".")[0];
      } else {
        file_name += d.data.audio[0].file_name.split(".")[0];
      }
    }

    console.log(`Starting render for video ${file_name}`);
    try {
      // Wait for each video to finish before starting the next one
      const response = await renderVideo(d, file_name);
      console.log(`Completed rendering video ${file_name}`);
    } catch (error) {
      console.error(`Failed to render video ${file_name}:`, error);
      // Continue with next video even if one fails
    }
  }
}

async function renderVideo(inputProps, uploadId) {
  try {
    // Bundle the video project
    const bundled = await bundle(REMOTION_INDEX);

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
