import { getAudioDurationInMs, transformUploads } from "./transformUploads.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

async function writeDataJson(files, isMultipleAudio, uploadId, audioType, audioPrompt) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataPath = path.join(__dirname, `../../data/data-${uploadId}.json`);

  let data = "";

  if (isMultipleAudio) {
    data = await transformUploads(files);
  } else if (audioType == "generate") {
    data = {
      images: files.images?.map((image) => image.filename),
      audioType,
      audioPrompt,
    };
  } else {
    const audioFile = files.audio[0];
    const audioPath = path.join(__dirname, "../../public/uploads", audioFile.filename);
    const durationInSeconds = await getAudioDurationInMs(audioPath);

    data = {
      images: files.images?.map((image) => image.filename),
      audio: audioFile.filename,
      duration: durationInSeconds, // Round to nearest second
    };
  }

  data.uploadId = uploadId;

  try {
    let formated = {};
    formated.data = data;
    await fs.writeFile(dataPath, JSON.stringify(formated, null, 2));
    console.log("data.json created successfully");
    return dataPath;
  } catch (error) {
    console.error("Error writing data.json:", error);
    throw error;
  }
}

export default writeDataJson;
