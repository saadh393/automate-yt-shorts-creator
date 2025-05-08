import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { createImageUrl, generateRandomSeed } from "../../src/lib/image-utils.js";
import { JSONS_DIR } from "../config/paths.js";
import renderVideo from "../piplines/render-video/index.js";
import updateProgress, { StatusType } from "../util/socket-update-progress.js";

const saveImages = async (item) => {
  const { ID } = item;
  const imagePrompts = item['image prompt'].split(",");
  const iterarion = imagePrompts.length

  const savedFileNames = [];
  const uploadsDir = path.join(process.cwd(), "public/uploads");

  for (let i = 1; i < iterarion; i++) {
    let success = false;
    let attempts = 0;
    const prompt = imagePrompts[i].trim()
    updateProgress(ID, StatusType.IMAGE, `Generating ${prompt} image`);

    while (!success && attempts < 20) {
      attempts++;
      const seed = generateRandomSeed();
      const imageUrl = createImageUrl(prompt, {
        model: "flux",
        width: 1080,
        height: 1920,
        nologo: true,
        enhance: true,
        safe: true,
        private: false,
        seed,
      }, 1080, 1920);

      try {
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 60000, // 60 seconds timeout
        });

        const fileName = `${ID}-${i}.jpg`;
        const filePath = path.join(uploadsDir, fileName);

        // Save the image to the uploads directory
        await fs.writeFile(filePath, response.data);
        savedFileNames.push(fileName);
        success = true;
        attempts = 0;
      } catch (error) {
        console.error(`Attempt ${attempts} failed for image ${i}:`, error.message);
      }
    }
  }

  return savedFileNames;
};

const processContentListController = async (req, res) => {
  try {
    // Read the content.json file
    const filePath = path.join(JSONS_DIR, "content.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const contents = JSON.parse(fileContent);
   
    // Synchronous loop over the contents array
    for (const item of contents) {
      const { Title, Script, ID, Upload } = item;

      // Skip if Upload is marked as DONE
      if (Upload === "DONE") {
        continue;
      }

      // Add your processing logic here
      const savedImages = await saveImages(item);
      if(!savedImages || savedImages.length === 0) {
        console.error(`Failed to save images for ID: ${ID}`);
        continue; // Skip to the next item if image saving fails
      }
      
      const jsonObject = {
        "data": {
          "images": savedImages,
          "audioType": "generate",
          "audioPrompt": Script,
          "uploadId": ID
        }
      }

      // Render Video
      await renderVideo(jsonObject)

      // Update the Upload status to DONE
      item.Upload = "DONE";

      // Save the updated content back to the file
      await fs.writeFile(filePath, JSON.stringify(contents, null, 2));
    }

    res.status(200).json({ message: "Content list processed successfully." });
  } catch (error) {
    console.error("Error processing content list:", error);
    res.status(500).json({ error: "Failed to process content list." });
  }
};

export default processContentListController;