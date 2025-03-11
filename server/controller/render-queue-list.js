import { EventEmitter } from "events";
import { DATA_DIR } from "../config/paths.js";
import renderVideo from "../piplines/render-video/index.js";
import getDataToRender from "../util/get-data-to-render.js";

// Increase EventEmitter limit to prevent warnings
EventEmitter.defaultMaxListeners = 50;

export default async function renderQueueListController(req, res) {
  global.io.emit("render", true);

  /** @type {DataContent[]}  */
  const data = await getDataToRender(DATA_DIR);

  // Process videos sequentially using for...of loop instead of map
  for (const [index, jsonObject] of data.entries()) {
    try {
      global.io.emit("message", `render-index-${index}`);
      console.log("Rendering for Index", index);
      await renderVideo(jsonObject);
    } catch (e) {
      console.error(e);
    }
  }

  global.io.emit("render", false);

  return { success: true };
}
