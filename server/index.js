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
async function writeDataJson(files, isMultipleAudio) {
  const dataPath = path.join(__dirname, "../data.json");
  let data = "";

  if (isMultipleAudio) {
    data = transformUploads(files);
  } else {
    data = {
      images: files.images?.filename,
      audio: files.audio[0]?.filename,
      duration: 5,
    };
  }

  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    console.log("data.json created successfully");
    return dataPath;
  } catch (error) {
    console.error("Error writing data.json:", error);
    throw error;
  }
}

// Function to render video using Remotion
async function renderVideo(dataPath) {
  try {
    console.log("Starting video rendering...");
    const outputDir = path.join(__dirname, "../public/output");

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Run Remotion render command
    const command = `npx remotion render src/remotion/index.js DynamicComposition2 --props="${dataPath}" --output="${path.join(
      outputDir,
      "output.mp4"
    )}"`;
    console.log("Executing command:", command);

    const { stdout, stderr } = await execAsync(command, {
      cwd: path.join(__dirname, ".."),
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    console.log("Render stdout:", stdout);
    if (stderr) console.error("Render stderr:", stderr);

    return path.join(outputDir, "output.mp4");
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}

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
app.use(async (req, res, next) => {
  if (req.path === "/api/upload" && req.method === "POST") {
    try {
      await cleanDirectory(path.join(__dirname, "../public/uploads"));
    } catch (error) {
      console.error("Error cleaning directory:", error);
    }
  }
  next();
});

// Upload endpoint
app.post(
  "/api/upload",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audio", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.images) {
        return res.status(400).json({ error: "No images were uploaded." });
      }

      if (!req.files.audio) {
        return res.status(400).json({ error: "No audio files were uploaded." });
      }

      const isMultipleAudio = req.headers["x-upload-type"] === "multiple";
      const dataPath = await writeDataJson(req.files, isMultipleAudio);
      const videoPath = await renderVideo(dataPath);

      res.json({
        message: "Files uploaded successfully",
        files: req.files,
        video: "/output/output.mp4",
      });
    } catch (error) {
      console.error("Error in upload endpoint:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/output", express.static(path.join(__dirname, "../public/output")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * Transforms an upload object containing images and audio files into a formatted array
 * @param {Object} uploadObj - Object containing arrays of image and audio file data
 * @param {number} defaultDuration - Default duration to use for each item
 * @returns {Array} Array of objects with image, audio, and duration properties
 */
function transformUploads(uploadObj, defaultDuration = 5) {
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

    result.push({
      image: currentImage.filename,
      audio: currentAudio.filename,
      duration: defaultDuration,
    });
  }

  return result;
}
