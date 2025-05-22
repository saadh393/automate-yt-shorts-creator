import fs from "fs/promises";
import path from "path";

export default function initialFileCreation() {
  // Check if Public director contains output folder or not, if not then create
  fs.access(OUTPUT_DIR, fs.constants.F_OK)
    .then(() => {
      console.log("Output directory exists.");
    })
    .catch(() => {
      console.log("Output directory does not exist, creating...");
      fs.mkdir(OUTPUT_DIR, { recursive: true })
        .then(() => {
          console.log("Output directory created.");
        })
        .catch((error) => {
          console.error("Error creating output directory:", error);
        });
    });

  fs.access(UPLOADS_DIR, fs.constants.F_OK)
    .then(() => {
      console.log("Uploads directory exists.");
    })
    .catch(() => {
      console.log("Uploads directory does not exist, creating...");
      fs.mkdir(UPLOADS_DIR, { recursive: true })
        .then(() => {
          console.log("Uploads directory created.");
        })
        .catch((error) => {
          console.error("Error creating uploads directory:", error);
        });
    });
}
