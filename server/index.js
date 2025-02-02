import ffmpeg from "fluent-ffmpeg";
import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// Increase the limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// Function to clean directory
async function cleanDirectory(directory) {
  try {
    await fs.rm(directory, { recursive: true, force: true });
    await fs.mkdir(directory, { recursive: true });
    console.log("Directory cleaned successfully:", directory);
  } catch (error) {
    console.error("Error cleaning directory:", error);
    throw error;
  }
}

// Function to write data.json
async function writeDataJson(files, isMultipleAudio, uploadId) {
  const dataPath = path.join(__dirname, `../data/data-${uploadId}.json`);
  let data = "";

  if (isMultipleAudio) {
    data = await transformUploads(files);
  } else {
    const audioFile = files.audio[0];
    const audioPath = path.join(
      __dirname,
      "../public/uploads",
      audioFile.filename
    );
    const durationInSeconds = await getAudioDurationInMs(audioPath);

    data = {
      images: files.images?.map((image) => image.filename),
      audio: audioFile.filename,
      duration: durationInSeconds, // Round to nearest second
    };
  }

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

// Function to render video using Remotion
async function renderVideo(dataPath, isMultiAudio, uploadId) {
  try {
    console.log("Starting video rendering...");
    const outputDir = path.join(__dirname, "../public/output");

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Run Remotion render command
    let command = `npx remotion render src/remotion/index.js single-audio --props="${dataPath}" --output="${path.join(
      outputDir,
      `output-${uploadId}.mp4`
    )}"`;

    console.log("isMultiAudio", isMultiAudio);
    if (isMultiAudio) {
      command = `npx remotion render src/remotion/index.js multiple-audio --props="${dataPath}" --output="${path.join(
        outputDir,
        `output-${uploadId}.mp4`
      )}"`;
    }

    const { stdout, stderr } = await execAsync(command, {
      cwd: path.join(__dirname, ".."),
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    console.log("Render stdout:", stdout);
    if (stderr) console.error("Render stderr:", stderr);

    return path.join(outputDir, `output-${uploadId}.mp4`);
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}

// Function to clean temporary files after video generation
async function cleanupTempFiles(uploadId) {
  try {
    // Clean up uploads
    const uploadsDir = path.join(__dirname, "../public/uploads");
    const files = await fs.readdir(uploadsDir);
    for (const file of files) {
      await fs.unlink(path.join(uploadsDir, file));
    }
    console.log("Cleaned up uploads directory");

    // Clean up data json
    const dataFile = path.join(__dirname, `../data/data-${uploadId}.json`);
    await fs.unlink(dataFile);
    console.log("Cleaned up data file:", dataFile);
  } catch (error) {
    console.error("Error cleaning up temporary files:", error);
  }
}

// Function to clean output directory
async function cleanOutputDirectory() {
  try {
    const outputDir = path.join(__dirname, "../public/output");
    await cleanDirectory(outputDir);
    console.log("Cleaned output directory");
  } catch (error) {
    console.error("Error cleaning output directory:", error);
  }
}

// Clean output directory when server starts
cleanOutputDirectory();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = path.join(__dirname, "../public/uploads");
    try {
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    // Check if this is a multiple audio upload request
    const isMultipleAudio = req.headers["x-upload-type"] === "multiple";

    if (isMultipleAudio) {
      // For multiple audio mode, match image and audio names
      // Initialize the counters if they don't exist
      req.imageCount = req.imageCount || 0;
      req.audioCount = req.audioCount || 0;

      const ext = path.extname(file.originalname);

      if (file.fieldname === "images") {
        const filename = `file-${req.imageCount}${ext}`;
        req.imageCount++;
        cb(null, filename);
      } else {
        // For audio, use audioCount to ensure unique names
        const filename = `file-${req.audioCount}${ext}`;
        req.audioCount++;
        cb(null, filename);
      }
    } else {
      // For single audio mode, use simple unique names
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Clean up directory before each upload
// app.use(async (req, res, next) => {
//   if (req.path === "/api/upload" && req.method === "POST") {
//     try {
//       // await cleanDirectory(path.join(__dirname, "../public/uploads"));
//     } catch (error) {
//       console.error("Error cleaning directory:", error);
//     }
//   }
//   next();
// });

// Upload endpoint
app.post(
  "/api/upload",
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "audio", maxCount: 20 },
  ]),
  async (req, res) => {
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
      const dataPath = await writeDataJson(
        req.files,
        isMultipleAudio,
        uploadId
      );

      // Only render video if it's not a queue upload
      let videoUrl = null;
      if (!isQueueUpload) {
        await renderVideo(dataPath, isMultipleAudio, uploadId);
        videoUrl = `/output/output-${uploadId}.mp4`;

        // Clean up temporary files
        // await cleanupTempFiles(uploadId);
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
);

// Debug edpoint
app.get("/api/debug", async (req, res) => {
  const dataPath = path.join(__dirname, "../data.json");
  const videoPath = await renderVideo(dataPath, true);
  res.json({ video: videoPath });
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/output", express.static(path.join(__dirname, "../public/output")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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
