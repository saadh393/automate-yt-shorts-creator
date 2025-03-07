import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, makeCancelSignal } from "@remotion/renderer";
import {
  DATA_DIR,
  getOutputVideoPath,
  REMOTION_INDEX,
  UPLOADS_DIR,
} from "../config/paths.js";
import fs from "fs/promises";
import path from "path";
import { EventEmitter } from "events";

// Increase EventEmitter limit to prevent warnings
EventEmitter.defaultMaxListeners = 50;

// Track active render processes
const activeRenders = new Map();

const { cancelSignal, cancel } = makeCancelSignal();

// Function to stop all active renders
export function stopAllRenders() {
  console.log(`Stopping all renders. Active renders: ${activeRenders.size}`);
  cancel()

  activeRenders.forEach((controller, id) => {
    console.log(`Aborting render for ${id}`);
    controller.abort();
    global.io.emit('renderAborted', { uploadId: id });
    activeRenders.delete(id);
  });

  return {
    success: true,
    message: `Stopped ${activeRenders.size} renders`
  };
}

export default async function renderQueueListController(req, res) {
  // Clear any existing renders if requested
  if (req.query.clear === 'true') {
    stopAllRenders();
    if (res) {
      return res.json({ success: true, message: "All renders cleared" });
    }
    return;
  }

  // Scan data folder for .json files
  const files = await fs.readdir(DATA_DIR);
  console.log("files", files);

  // Read all the data.json files and store in array
  const data = await Promise.all(
    files.map(async (file) => {
      const dataPath = path.join(DATA_DIR, file);
      const data = await fs.readFile(dataPath, "utf-8");
      return JSON.parse(data);
    })
  );

  console.log("Data", data);

  // Return immediately to not block the request
  if (res) {
    res.json({ success: true, message: `Starting render for ${data.length} videos` });
  }

  // Process videos sequentially using for...of loop instead of map
  for (let index = 0; index < data.length; index++) {
    const d = data[index];

    let file_name = d.data.audio.split(".")[0] // audio_file.mp3 => [audio_file, mp3]
    
    try {

      // Wait for each video to finish before starting the next one
      await renderVideo(d, file_name);
      const dataFileName = `data-${file_name}.json`;
      const dataPath = path.join(DATA_DIR, dataFileName);

      // delete the images
      d.data.images.forEach(async (image) => {
        await fs.unlink(path.join(UPLOADS_DIR, image));
      });

      // Delete the audio
      await fs.unlink(path.join(UPLOADS_DIR, d.data.audio));

      // Delete the data file after rendering
      await fs.unlink(dataPath);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Rendering aborted for ${file_name}`);
        global.io.emit('renderAborted', { uploadId: file_name });
      } else {
        console.error(`Failed to render video ${file_name}:`, error);
      }
    }
  }

  return { success: true };
}

async function renderVideo(inputProps, uploadId) {
  // Create a new AbortController for this render
  const controller = new AbortController();
  activeRenders.set(uploadId, controller);

  try {
    // Notify frontend that rendering is starting
    global.io.emit('renderStart', { uploadId });
    console.log(
      `Rendering video with audio: ${uploadId} `
    )

    // Bundle the video project
    const bundled = await bundle(REMOTION_INDEX);

    // Select the composition
    const composition = await selectComposition({
      serveUrl: bundled,
      id: "single-audio",
      inputProps: inputProps
    });

    // Render the video
    const outputPath = getOutputVideoPath(uploadId);
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: inputProps,
      cancelSignal,
      onProgress: ({ progress }) => {
        // Convert progress from 0-1 to percentage
        const percentage = Math.floor(progress * 100);
        global.io.emit('renderProgress', { uploadId, progress: percentage });
      },
    });

    global.io.emit('renderComplete', { uploadId, outputPath });

    // Clean up the controller after successful render
    activeRenders.delete(uploadId);

    return outputPath;
  } catch (error) {
    // Check if this is an abort error
    if (error.name === 'AbortError') {
      global.io.emit('renderAborted', { uploadId });
      console.log(`Rendering aborted for ${uploadId}`);
    } else {
      global.io.emit('renderError', { uploadId, error: error.message });
      console.error(`Error rendering video ${uploadId}:`, error);
    }

    // Clean up the controller after error
    activeRenders.delete(uploadId);
    throw error;
  }
}
