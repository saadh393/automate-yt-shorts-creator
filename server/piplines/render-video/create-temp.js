import fs from "fs/promises";
import path from "path";
import { PUBLIC_DIR, UPLOADS_DIR } from "../../config/paths.js";

/**
 * @param {Object} jsonObject - The object that contains the data for video rendering
 * @param {Object} jsonObject.data - The data object
 * @param {string[]} jsonObject.data.images - The array of image paths
 * @param {string} jsonObject.data.audio - The path to the audio file
 * @param {number} jsonObject.data.duration - The duration of the video in ms
 */
export default async function createTempFile(jsonObject, temp_folder) {
  const audio = jsonObject.data.audio;
  const images = jsonObject.data.images;

  // Check if `temp` folder exists or not
  try {
    await fs.access(temp_folder);
  } catch {
    await fs.mkdir(temp_folder, { recursive: true });
  }

  // Clean up existing files
  const existingFiles = await fs.readdir(temp_folder);
  if (existingFiles.length > 0) {
    for (const file of existingFiles) {
      await fs.unlink(path.join(temp_folder, file));
    }
  }

  // Move the Audio
  const audioFilePath = path.join(UPLOADS_DIR, audio);
  try {
    await fs.access(audioFilePath); // checks if file exists
    await fs.rename(audioFilePath, path.join(temp_folder, audio));
  } catch {
    throw new Error("Not Found Audio during temp file creation: ", audioFilePath);
  }

  // Move the Images
  for await (let image of images) {
    const imageFilePath = path.join(UPLOADS_DIR, image);

    try {
      await fs.access(imageFilePath);
      await fs.rename(imageFilePath, path.join(temp_folder, image));
    } catch {
      throw new Error("Not Found Image during temp file creation: ", imageFilePath);
    }
  }

  console.log("Done");
}
