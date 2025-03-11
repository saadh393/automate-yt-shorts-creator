import fs from "fs/promises";
import { DATA_DIR, OUTPUT_DIR, UPLOADS_DIR } from "../config/paths.js";

async function safeRemoveDirectory(path) {
  try {
    // Check if the directory exists
    await fs.access(path);

    // Only attempt to remove if it exists
    try {
      await fs.rm(path, { recursive: true });
      console.log(`Removed: ${path}`);
    } catch (e) {
      console.error(`Failed to remove ${path}: ${e.message}`);
    }
  } catch (e) {
    // Directory doesn't exist, just log and continue
    console.warn(`Skipping removal, directory does not exist: ${path}`);
  }
}

async function safeCreateDirectory(path) {
  try {
    await fs.mkdir(path, { recursive: true });
    console.log(`Created: ${path}`);
  } catch (e) {
    console.error(`Failed to create ${path}: ${e.message}`);
  }
}

export default async function ClearCache(req, res) {
  const directories = [DATA_DIR, OUTPUT_DIR, UPLOADS_DIR];

  try {
    for (const dir of directories) {
      await safeRemoveDirectory(dir);
      await safeCreateDirectory(dir);
    }

    res.json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Cache clearing error:", error);
    res.status(500).json({ message: "Failed to clear cache", error: error.message });
  }
}
