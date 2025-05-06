import { JSONS_DIR } from "../config/paths.js";
import fs from "fs/promises";
import path from "path";

const fetchJsonController = async (req, res) => {
  try {
    const filePath = path.join(JSONS_DIR, "content.json");

    // Read the content.json file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Error fetching JSON file:", error);
    res.status(500).json({ error: "Failed to fetch JSON file" });
  }
};

export default fetchJsonController;