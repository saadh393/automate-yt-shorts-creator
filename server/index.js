import cors from "cors";
import express from "express";
import { promises as fs } from "fs";
import http from "http";
import multer from "multer";
import path from "path";
import { Server } from "socket.io";

import { uploadConfig } from "./config.js";
import { OUTPUT_DIR, UPLOADS_DIR } from "./config/paths.js";
import queueListController from "./controller/queue-list.js";
import renderQueueListController from "./controller/render-queue-list.js";
import uploadController from "./controller/upload.controller.js";
import ClearCache from "./controller/clearCacheController.js";

const app = express();
const port = 9000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make socket.io instance globally available
global.io = io;

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
    // For single audio mode, keep original name with short random suffix
    const ext = path.extname(file.originalname);
    const imageExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const isImage = imageExt.includes(ext);

    const nameWithoutExt = path.basename(file.originalname, ext);
    const shortRandomSuffix = Math.floor(Math.random() * 10000);
    req.audioFileName = nameWithoutExt;
    if (isImage) {
      cb(null, `${nameWithoutExt}-${shortRandomSuffix}${ext}`);
    } else {
      cb(null, `${nameWithoutExt}${ext}`);
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

app.get("/api/clear-cache", ClearCache);

// let str = `{
//   "data": {
//     "images": [
//       "image-0-1744.png",
//       "image-1-9402.png"
//     ],
//     "audio": "speech_saad.wav",
//     "duration": 5283.265
//   }
// }`;

// await setupTestEnvironment();

// renderVideo(JSON.parse(str));

// async function setupTestEnvironment() {
//   const test_resource = path.join(PUBLIC_DIR, "test-resource");
//   const upload_directory = path.join(UPLOADS_DIR);

//   const test_files = await fs.readdir(test_resource);
//   for (const file of test_files) {
//     await fs.copyFile(path.join(test_resource, file), path.join(upload_directory, file));
//   }
// }

// const { transcription } = await transcribe({
//   model: "small",
//   whisperPath: "/home/saad/Programming/temp-project/remotion-scratch/server/subtitle/whisper.cpp",
//   whisperCppVersion: "1.5.5",
//   inputPath: path.join(SERVER_DIR, "public", "output.wav"),
//   tokenLevelTimestamps: true,
// });

// for (const token of transcription) {
//   console.log(token.timestamps.from, token.timestamps.to, token.text);
// }

// // Optional: Apply our recommended postprocessing
// const { captions } = convertToCaptions({
//   transcription,
//   combineTokensWithinMilliseconds: 200,
// });

// for (const line of captions) {
//   console.log(line.text, line.startInSeconds);
// }

// Serve static files
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/output", express.static(OUTPUT_DIR));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
