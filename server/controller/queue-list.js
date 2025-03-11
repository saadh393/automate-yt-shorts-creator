import fs from "fs/promises";
import { DATA_DIR } from "../config/paths.js";

export default async function queueListController(req, res) {
  try {
    // Sccan data folder to .json files
    const files = await fs.readdir(DATA_DIR);
    res.json(files);
  } catch (e) {
    res.json(null);
  }
}
