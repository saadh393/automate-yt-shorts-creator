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
    audio: files.audio?.map(file => file.filename) || [],
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
  destination(req, file, cb) {
    const dir = path.join(__dirname, '..', file.fieldname === 'audio' ? 'public/audio' : 'public/images');
    fs.mkdir(dir, { recursive: true })
      .then(() => cb(null, dir))
      .catch(err => cb(err));
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Handle multiple image uploads and single audio upload
app.post('/api/upload', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'audio', maxCount: 10 }
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
      images: files.images?.map(file => `/images/${file.filename}`) || [],
      audio: files.audio?.map(file => `/audio/${file.filename}`) || [],
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
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));
app.use('/output', express.static(path.join(__dirname, '../public/output')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
