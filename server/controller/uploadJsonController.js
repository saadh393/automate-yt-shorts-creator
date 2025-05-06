import fs from "fs/promises";
import { JSONS_DIR } from "../config/paths.js";

const uploadJsonController = async (req, res) => {
  try {
    const jsonData = req.body;

    // Ensure the JSONS_DIR exists
    await fs.mkdir(JSONS_DIR, { recursive: true });

    // Write the JSON data to content.json
    const filePath = `${JSONS_DIR}/content.json`;
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    res.status(200).json({ message: "JSON file uploaded successfully", filePath });
  } catch (error) {
    console.error("Error uploading JSON file:", error);
    res.status(500).json({ error: "Failed to upload JSON file" });
  }
};

export default uploadJsonController;