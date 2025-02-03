import ffmpeg from "fluent-ffmpeg";
import path from "path";

/**
 * Transforms an upload object containing images and audio files into a formatted array
 * @param {Object} uploadObj - Object containing arrays of image and audio file data
 * @returns {Array} Array of objects with image, audio, and duration properties
 */
async function transformUploads(uploadObj) {
  // Get the arrays of images and audio, or use empty arrays if not present
  const images = uploadObj.images || [];
  const audio = uploadObj.audio || [];

  // Get the maximum length between images and audio arrays
  const maxLength = Math.max(images.length, audio.length);

  // Create the transformed array
  const result = [];

  for (let i = 0; i < maxLength; i++) {
    // Get current image and audio, or use the last one if index exceeds array length
    const currentImage = images[i % images.length];
    const currentAudio = audio[i % audio.length];

    const audioPath = path.join(
      __dirname,
      "../public/uploads",
      currentAudio.filename
    );
    try {
      const durationInSeconds = await getAudioDurationInMs(audioPath);
      result.push({
        image: currentImage.filename,
        audio: currentAudio.filename,
        duration: durationInSeconds, // Round to nearest second
      });
    } catch (error) {
      console.error(
        `Error getting duration for ${currentAudio.filename}:`,
        error
      );
      result.push({
        image: currentImage.filename,
        audio: currentAudio.filename,
        duration: 5, // Fallback to 5 seconds if duration cannot be determined
      });
    }
  }

  return result;
}

async function getAudioDurationInMs(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const durationInMs = metadata.format.duration * 1000; // Convert seconds to milliseconds
        resolve(durationInMs);
      }
    });
  });
}

export { transformUploads, getAudioDurationInMs };
