import fs from "fs/promises";
import path from "path";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";

/**
 * @param {DataContent} jsonObject
 */
export default async function Validation(jsonObject, UPLOADS_DIR) {
  const audio = jsonObject.data.audio;
  const images = jsonObject.data.images;
  updateProgress(jsonObject.data.audio, StatusType.VALIDATION, "Validating the resources");

  // Check if `temp` folder exists or not
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    const errorMessage = `${UPLOADS_DIR} directory not found`;
    updateProgress(jsonObject.data.audio, StatusType.ERROR, errorMessage);
    throw new Error(errorMessage);
  }

  // Move the Audio
  const audioFilePath = path.join(UPLOADS_DIR, audio);
  try {
    await fs.access(audioFilePath); // checks if file exists
  } catch {
    const errorMessage = `Audio Not Found at : ${audioFilePath}`;
    updateProgress(jsonObject.data.audio, StatusType.ERROR, errorMessage);
    throw new Error(errorMessage);
  }

  // Move the Images
  for await (let image of images) {
    const imageFilePath = path.join(UPLOADS_DIR, image);

    try {
      await fs.access(imageFilePath);
    } catch {
      const errorMessage = `Image Not Found at : ${imageFilePath}`;
      updateProgress(jsonObject.data.audio, StatusType.ERROR, errorMessage);
      throw new Error(errorMessage);
    }
  }
}
