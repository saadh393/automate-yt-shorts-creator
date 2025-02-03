import { exec } from "child_process";
import fs from "fs/promises";
import { promisify } from "util";
import {
  OUTPUT_DIR,
  REMOTION_INDEX,
  ROOT_DIR,
  getOutputVideoPath,
} from "../config/paths.js";
import path from "path";

const execAsync = promisify(exec);

// Function to render video using Remotion
export default async function renderVideo(dataPath, isMultiAudio, uploadId) {
  try {
    console.log("Starting video rendering...");
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Run Remotion render command
    const componentId = isMultiAudio ? "multiple-audio" : "single-audio";
    const outputPath = getOutputVideoPath(uploadId);

    const command = `npx remotion render --chrome-mode="chrome-for-testing" --gl=vulkan ${REMOTION_INDEX} ${componentId} --props="${dataPath}" --output="${outputPath}"`;

    const { stdout, stderr } = await execAsync(command, {
      cwd: ROOT_DIR,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    console.log("Render stdout:", stdout);
    if (stderr) console.error("Render stderr:", stderr);

    return path.join(OUTPUT_DIR, `output-${uploadId}.mp4`);
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}
