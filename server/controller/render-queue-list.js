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
    });

    return outputPath;
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}
