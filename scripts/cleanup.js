// scripts/cleanup.js
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoriesToClean = [
  path.join(__dirname, "../data"),
  path.join(__dirname, "../public/output"),
  path.join(__dirname, "../public/uploads"),
];

async function cleanDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await fs.rm(filePath, { recursive: true, force: true });
      } else {
        await fs.unlink(filePath);
      }
    }
    console.log(`Cleaned directory: ${path.relative(__dirname, dirPath)}`);
  } catch (error) {
    console.error(`Error cleaning ${dirPath}:`, error.message);
  }
}

(async () => {
  try {
    for (const dir of directoriesToClean) {
      await cleanDirectory(dir);
    }
    console.log("Cleanup completed successfully");
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
})();
