
/**
 * @enum {Object}
 */
export const StatusType = {
  STARTED: "started",
  ERROR: "error",
  VALIDATION: "validation",
  FFMPEG: "ffmpeg",
  SUBTITLE: "subtitle",
  RENDER: "rendering",
  PROGRESS: "render_progress",
  REMOVE_TEMP: "temp",
  COMPLETE: "complete",
  IMAGE : "IMAGE"
};

/**
 *
 * @param {string} audio_file_name - aba asdl adsf.mp3
 * @param {StatusType} status - Available file Status
 * @param {string} message - Any Message
 */
export default function updateProgress(audio_file_name, status = null, message = null) {
  console.log(message)
  const id = audio_file_name.replace(/\s+/g, "_");
  global.io.emit("render_progress", {
    id,
    status,
    message,
  });
}
