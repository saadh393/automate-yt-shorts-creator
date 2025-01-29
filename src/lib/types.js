/**
 * @typedef {Object} AppContextState
 * @property {import('@/lib/constants').STATE} state - Current application state
 * @property {Error|null} error - Error object if any error occurs
 * @property {Array<ImageObject>} images - Array of generated images
 * @property {boolean} generating - Flag indicating if image generation is in progress
 * @property {Array<ImageObject>} selectedImages - Array of selected images
 * @property {function} handleGenerateImage - Function to generate images
 */

/**
 * @typedef {Object} ImageObject
 * @property {string} url - URL of the generated image
 * @property {string} id - Unique identifier for the image
 * @property {number} width - Width of the image
 * @property {number} height - Height of the image
 */

/**
 * @typedef {Object} GenerateImageParams
 * @property {string} prompt - Text prompt for image generation
 * @property {number} [width] - Optional width for generated image
 * @property {number} [height] - Optional height for generated image
 * @property {string} [style] - Optional style parameter for image generation
 */

/**
 * @callback HandleGenerateImage
 * @param {GenerateImageParams} params - Parameters for image generation
 * @returns {Promise<void>}
 */

/**
 * Hook to access the App context
 * @returns {AppContextState} The current app context state
 * @throws {Error} If used outside of AppProvider
 */
