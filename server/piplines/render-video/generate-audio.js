import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import { UPLOADS_DIR } from '../../config/paths.js';
import getAudioDurationInMs from '../../util/get-audio-duration.js';
import updateProgress, { StatusType } from '../../util/socket-update-progress.js';

const API_ENDPOINT = 'http://localhost:8880/dev/captioned_speech';
const model = 'kokoro';
const voice = 'am_adam';
const speed = 1.0;
const response_format = 'mp3';
const stream = false;

/**
 * Converts Kokoro-FastAPI timestamps to Remotion's caption format.
 * @param {Array} timestamps - Array of word-level timestamps from Kokoro.
 * @returns {Array} - Array of captions compatible with Remotion.
 */
function convertKokoroToCaptions(timestamps) {
  console.log(timestamps)
  return timestamps.map(({ word, start_time: start, end_time: end }) => {
    const startMs = Math.round(start * 1000);
    const endMs = Math.round(end * 1000);

    const punctuation = [',', '.', '!', '?', ':', ';'];
    let text = punctuation.includes(word)? word : ` ${word}`;

    return {
      text,
      startMs,
      endMs,
      timestampMs: Math.round((startMs + endMs) / 2),
      confidence: 1,
    };
  });
}

/**
 * Generates audio with captions using Kokoro-FastAPI and processes the output.
 * @param {Object} jsonObject - Input data containing audioPrompt and uploadId.
 * @returns {Object} - Object containing outputPath, duration, and captions.
 */
export default async function generateAudioWithCaptions(jsonObject) {
  const input = jsonObject.data.audioPrompt;
  const uploadId = jsonObject.data.uploadId;
  const outputPath = path.join(UPLOADS_DIR, `${uploadId}.mp3`);

  try {
    updateProgress(uploadId, StatusType.VALIDATION, '🎵 Generating audio with captions');

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        input,
        voice,
        speed,
        response_format,
        stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      updateProgress(uploadId, StatusType.ERROR, `❌ API Error: ${response.status} - ${errorText}`);
      throw new Error(`Kokoro API Error: ${response.status} - ${errorText}`);
    }

    const { audio, timestamps } = await response.json();

    if (!audio || !timestamps || !Array.isArray(timestamps)) {
      updateProgress(uploadId, StatusType.ERROR, '❌ Invalid response from Kokoro API');
      throw new Error('Invalid response from Kokoro API');
    }

    // Decode base64 audio and save to file
    const audioBuffer = Buffer.from(audio, 'base64');
    await fs.writeFile(outputPath, audioBuffer);

    // Get audio duration
    const duration = await getAudioDurationInMs(outputPath);

    // Convert timestamps to Remotion captions
    const captions = convertKokoroToCaptions(timestamps);

    updateProgress(uploadId, StatusType.SUBTITLE, '✅ Audio and captions generated successfully');

    console.log(captions)

    return { outputPath, duration, captions };
  } catch (error) {
    updateProgress(uploadId, StatusType.ERROR, `❌ Error: ${error.message}`);
    throw error;
  }
}