import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// Increase the limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Function to clean directory
async function cleanDirectory(directory) {
  try {
    await fs.rm(directory, { recursive: true, force: true });
    await fs.mkdir(directory, { recursive: true });
    console.log('Directory cleaned successfully:', directory);
  } catch (error) {
    console.error('Error cleaning directory:', error);
    throw error;
  }
}

// Function to write data.json
async function writeDataJson(files) {
  const dataPath = path.join(__dirname, '../data.json');
  const data = {
    images: files.images?.map(file => file.filename) || [],
    audio: files.audio?.[0] ? files.audio[0].filename : null,
    duration: 10 // Default duration in seconds
  };

  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    console.log('data.json created successfully');
    return dataPath;
  } catch (error) {
    console.error('Error writing data.json:', error);
    throw error;
  }
}

// Function to render video using Remotion
async function renderVideo(dataPath) {
  try {
    console.log('Starting video rendering...');
    const outputDir = path.join(__dirname, '../public/output');
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run Remotion render command
    const command = `npx remotion render src/remotion/index.js DynamicComposition2 --props="${dataPath}" --output="${path.join(outputDir, 'output.mp4')}"`;
    console.log('Executing command:', command);
    
    const { stdout, stderr } = await execAsync(command, {
      cwd: path.join(__dirname, '..'),
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    console.log('Render stdout:', stdout);
    if (stderr) console.error('Render stderr:', stderr);
    
    return path.join(outputDir, 'output.mp4');
  } catch (error) {
    console.error('Error rendering video:', error);
    throw error;
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    try {
      // Only clean directory for the first file
      if (!req.uploadDirCleaned) {
        await cleanDirectory(uploadDir);
        req.uploadDirCleaned = true;
      }
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'audio') {
      // Keep original extension for audio file
      const ext = path.extname(file.originalname);
      cb(null, `audio${ext}`);
    } else {
      // For images, use index number in the name
      const imageIndex = req.imageCount = (req.imageCount || 0) + 1;
      const ext = path.extname(file.originalname) || '.png';
      cb(null, `image-${imageIndex}${ext}`);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 13 // 12 images + 1 audio file
  }
});

// Handle multiple image uploads and single audio upload
app.post('/api/upload', upload.fields([
  { name: 'images', maxCount: 12 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    console.log('Received files:', files);
    
    if (!files || (!files.images && !files.audio)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Write data.json with the uploaded files information
    const dataPath = await writeDataJson(files);

    // Start video rendering
    const videoPath = await renderVideo(dataPath);

    const uploadedFiles = {
      images: files.images?.map(file => `/uploads/${file.filename}`) || [],
      audio: files.audio?.[0] ? `/uploads/${files.audio[0].filename}` : null,
      video: '/output/output.mp4'
    };

    console.log('Upload and render successful:', uploadedFiles);
    res.json({
      message: 'Files uploaded and video rendered successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload or render error:', error);
    res.status(500).json({ error: 'Error processing files: ' + error.message });
  }
});

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/output', express.static(path.join(__dirname, '../public/output')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
