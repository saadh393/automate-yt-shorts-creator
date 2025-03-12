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
import axios from "axios";

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
    console.log(file);
    // For single audio mode, keep original name with short random suffix
    const ext = path.extname(file.originalname);
    const imageExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const isImage = imageExt.includes(ext);

    const nameWithoutExt = path.basename(file.originalname, ext);
    const shortRandomSuffix = Math.floor(Math.random() * 10000);
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

app.get("/api/fetch-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// Serve static files
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/output", express.static(OUTPUT_DIR));

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
