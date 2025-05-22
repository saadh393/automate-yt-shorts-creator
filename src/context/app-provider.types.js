/**
 * Represents the configuration settings for an image generation process.
 *
 * @typedef {Object} Config
 * @property {string} aspectRatio - The aspect ratio of the generated images (e.g., "Portrait (9:16)").
 * @property {boolean} customDimensions - Whether custom dimensions are used.
 * @property {Object} config - Detailed configuration for the image generation.
 * @property {string} config.model - The model used for image generation.
 * @property {number} config.width - The width of the generated images in pixels.
 * @property {number} config.height - The height of the generated images in pixels.
 * @property {number} config.seed - The seed value for randomization.
 * @property {boolean} config.nologo - Whether to exclude logos from the generated images.
 * @property {boolean} config.enhance - Whether to apply enhancements to the images.
 * @property {boolean} config.safe - Whether to enable safety filters.
 * @property {boolean} config.private - Whether the images are private.
 * @property {number} config.imageCount - The number of images to generate.
 * @property {number} imageCount - The total number of images to generate (duplicate of `config.imageCount`).
 * @property {"generate" | "upload"} audio - Define if audio is Upload or Generate
 */
