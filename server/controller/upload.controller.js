import renderVideo from "../util/renderVideo.js";
import writeDataJson from "../util/writeDataJson.js";
import fs from "fs/promises";

export default async function uploadController(req, res) {
  try {
    const uploadId = req.body.uploadId;
    if (!uploadId) {
      throw new Error("Upload ID is required");
    }

    const isMultipleAudio = req.body.isMultipleAudio === "true";
    const isQueueUpload = req.body.isQueueUpload === "true";

    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "No images were uploaded." });
    }

    if (!req.files.audio) {
      return res.status(400).json({ error: "No audio files were uploaded." });
    }

    // Write data.json with the files information
    const dataPath = await writeDataJson(req.files, isMultipleAudio, uploadId);

    // Only render video if it's not a queue upload
    let videoUrl = null;
    if (!isQueueUpload) {
      await renderVideo(dataPath, isMultipleAudio, uploadId);

      // Delete the data.json after rendering
      await fs.unlink(dataPath);

      // Delete the audio files after rendering
      for (const file of req.files.audio) {
        await fs.unlink(file.path);
      }

      // Delete the image files after rendering
      for (const file of req.files.images) {
        await fs.unlink(file.path);
      }

      videoUrl = `/output/output-${uploadId}.mp4`;
    }

    // Return response
    res.json({
      success: true,
      videoUrl,
      message: isQueueUpload
        ? "Files queued successfully"
        : "Video rendered successfully",
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({ error: error.message });
  }
}
