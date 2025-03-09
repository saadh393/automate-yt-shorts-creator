import { convertToCaptions, toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import path from "path";
import { SERVER_DIR } from "../../config/paths.js";

const MODEL_NAME = "small";
const MODEL_PATH = path.join(SERVER_DIR, "subtitle", "whisper.cpp");
const MODEL_VERSION = "1.5.5";

/**
 * An array of caption objects generated from the audio.
 * Each caption object contains the following properties:
 * @typedef {Object} Caption
 * @property {string} text - The text of the caption.
 * @property {number} startMs - The start time of the caption in milliseconds.
 * @property {number} endMs - The end time of the caption in milliseconds.
 * @property {number} timestampMs - The timestamp of the caption in milliseconds.
 * @property {number} confidence - The confidence score of the caption.
 *
 * @type {Caption[]}
 */
export default async function generate_subtitle(convertedAudioPath) {
  try {
    const whisperCppOutput = await transcribe({
      model: MODEL_NAME,
      whisperPath: MODEL_PATH,
      whisperCppVersion: MODEL_VERSION,
      inputPath: convertedAudioPath,
      tokenLevelTimestamps: true,
    });

    const { captions } = toCaptions({ whisperCppOutput });

    /** @type Caption */
    return captions;
  } catch (e) {
    throw new Error(e);
  }
}
