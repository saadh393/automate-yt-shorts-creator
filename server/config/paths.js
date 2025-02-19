import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths
export const ROOT_DIR = path.join(__dirname, "../..");
export const SERVER_DIR = path.join(ROOT_DIR, "server");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");
export const DATA_DIR = path.join(ROOT_DIR, "data");

// Public subdirectories
export const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
export const OUTPUT_DIR = path.join(PUBLIC_DIR, "output");

// Source paths
export const SRC_DIR = path.join(ROOT_DIR, "src");
export const REMOTION_INDEX = path.join(SRC_DIR, "remotion/index.js");

// Export a function to get output video path
export const getOutputVideoPath = (uploadId) =>
  path.join(OUTPUT_DIR, `${uploadId}.mp4`);

// Export a function to ensure all required directories exist
export async function ensureDirectories() {
  const directories = [PUBLIC_DIR, UPLOADS_DIR, OUTPUT_DIR];
  await Promise.all(
    directories.map((dir) => fs.mkdir(dir, { recursive: true }))
  );
}
