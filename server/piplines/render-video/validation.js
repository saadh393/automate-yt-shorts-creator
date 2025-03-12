import fs from "fs/promises";
import path from "path";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";

/**
 * @param {DataContent} jsonObject
 */
export default async function Validation(jsonObject, UPLOADS_DIR) {
  const audio = jsonObject.data.audio;
  const images = jsonObject.data.images;
  updateProgress(jsonObject.data.uploadId, StatusType.VALIDATION, "🔍️ Validating the resources");

  // Check if `temp` folder exists or not
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    const errorMessage = `${UPLOADS_DIR} directory not found`;
    updateProgress(jsonObject.data.uploadId, StatusType.ERROR, errorMessage);
    throw new Error(errorMessage);
  }

  // Check if audio file exists
  if (jsonObject.data?.audioType != "generate") {
    const audioFilePath = path.join(UPLOADS_DIR, audio);
    try {
      await fs.access(audioFilePath); // checks if file exists
    } catch (e) {
      const errorMessage = `ValidationError : Audio Not Found `;
      updateProgress(jsonObject.data.uploadId, StatusType.ERROR, errorMessage);
      throw new Error(e);
    }
  }

  // Move the Images
  for await (let image of images) {
    const imageFilePath = path.join(UPLOADS_DIR, image);

    try {
      await fs.access(imageFilePath);
    } catch (e) {
      const errorMessage = `ValidationError : Image Not Found `;
      updateProgress(jsonObject.data.uploadId, StatusType.ERROR, errorMessage);
      throw new Error(e);
    }
  }
}
