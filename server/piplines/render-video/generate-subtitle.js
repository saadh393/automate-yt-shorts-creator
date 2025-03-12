import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import path from "path";
import { SERVER_DIR } from "../../config/paths.js";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";

const MODEL_NAME = "small";
const MODEL_PATH = path.join(SERVER_DIR, "subtitle", "whisper.cpp");
const MODEL_VERSION = "1.5.5";

/**
 *
 * @param {string} convertedAudioPath - Converted autio path - /public/upload/output-filename.wav
 * @param {DataType} jsonObject
 * @returns {Caption}
 */
export default async function generate_subtitle(convertedAudioPath, jsonObject) {
  try {
    updateProgress(jsonObject.data.uploadId, StatusType.SUBTITLE, "✍️ Transcribing the audio file");

    const whisperCppOutput = await transcribe({
      model: MODEL_NAME,
      whisperPath: MODEL_PATH,
      whisperCppVersion: MODEL_VERSION,
      inputPath: convertedAudioPath,
      tokenLevelTimestamps: true,
    });

    const { captions } = toCaptions({ whisperCppOutput });

    /** @type {Caption} caption */
    return captions;
  } catch (e) {
    updateProgress(jsonObject.data.uploadId, StatusType.ERROR, "Transcribing ERROR : " + e);
    throw new Error(e);
  }
}
