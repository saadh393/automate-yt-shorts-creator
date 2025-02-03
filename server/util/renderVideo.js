import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to render video using Remotion
export default async function renderVideo(dataPath, isMultiAudio, uploadId) {
  try {
    console.log("Starting video rendering...");
    const outputDir = path.join(__dirname, "../../public/output");

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Run Remotion render command
    let command = `npx remotion render src/remotion/index.js single-audio --props="${dataPath}" --output="${path.join(
      outputDir,
      `output-${uploadId}.mp4`
    )}"`;

    console.log("isMultiAudio", isMultiAudio);
    if (isMultiAudio) {
      command = `npx remotion render src/remotion/index.js multiple-audio --props="${dataPath}" --output="${path.join(
        outputDir,
        `output-${uploadId}.mp4`
      )}"`;
    }

    const { stdout, stderr } = await execAsync(command, {
      cwd: path.join(__dirname, ".."),
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    console.log("Render stdout:", stdout);
    if (stderr) console.error("Render stderr:", stderr);

    return path.join(outputDir, `output-${uploadId}.mp4`);
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}
