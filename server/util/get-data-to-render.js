import fs from "fs/promises";
import path from "path";

/**
 *
 * @param {string} DATA_DIR - A full path of data directory where data.json lives
 * @returns {DataContent[]} - All the available data contents which should be rendered
 */

export default async function getDataToRender(DATA_DIR) {
  const files = await fs.readdir(DATA_DIR);

  // Read all the data.json files and store in array
  const data = await Promise.all(
    files.map(async (file) => {
      const dataPath = path.join(DATA_DIR, file);
      const data = await fs.readFile(dataPath, "utf-8");
      return JSON.parse(data);
    })
  );

  return data;
}
