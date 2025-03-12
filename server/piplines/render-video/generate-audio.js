import fs from "fs/promises";
import path from "path";
import { OUTPUT_DIR, UPLOADS_DIR } from "../../config/paths.js";
import fetch from "node-fetch";
import getAudioDurationInMs from "../../util/get-audio-duration.js";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";

const API_ENDPOINT = "http://localhost:8880/dev/captioned_speech";
const method = "POST";
const model = "kokoro";
const voice = "am_adam";
const speed = 1;
const response_format = "mp3";
const stream = false;

/**
 *
 * @param {DataType} jsonObject
 */
export default async function generateAudio(jsonObject) {
  const input = jsonObject.data.audioPrompt;
  const outputPath = path.join(UPLOADS_DIR, jsonObject.data.uploadId + ".mp3");

  updateProgress(jsonObject.data.uploadId, StatusType.VALIDATION, "🎵 Generating the audio");

  const response = await fetch(API_ENDPOINT, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
      voice,
      speed,
      response_format,
      stream,
    }),
  });

  // Check if the response is successful
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Get the response as an ArrayBuffer
  const audioBuffer = await response.arrayBuffer();

  // Write the buffer to a file
  await fs.writeFile(outputPath, Buffer.from(audioBuffer));

  // Get Audio Duration
  const duration = await getAudioDurationInMs(outputPath);

  return { outputPath, duration };
}
