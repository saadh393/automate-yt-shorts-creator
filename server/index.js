import cors from "cors";
import express from "express";
import { promises as fs } from "fs";
import multer from "multer";
import path from "path";

import { uploadConfig } from "./config.js";
import { OUTPUT_DIR, UPLOADS_DIR } from "./config/paths.js";
import uploadController from "./controller/upload.controller.js";
import queueListController from "./controller/queue-list.js";
import renderQueueListController from "./controller/render-queue-list.js";

const app = express();
const port = 9000;

// Increase the limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      cb(null, UPLOADS_DIR);
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
      // For single audio mode, keep original name with short random suffix
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      const shortRandomSuffix = Math.floor(Math.random() * 10000);
      cb(null, `${nameWithoutExt}-${shortRandomSuffix}${ext}`);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Upload endpoint
app.post("/api/upload", upload.fields(uploadConfig), uploadController);

app.get("/api/queue_list", queueListController);

app.get("/api/render-queue-list", renderQueueListController);

renderQueueListController()

// Serve static files
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/output", express.static(OUTPUT_DIR));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
