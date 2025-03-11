/**
 * @typedef {Object} Caption
 * @property {string} fileName - localhost:3000/bundle.js
 * @property {string} functionName - createTikTokStyleCaptions
 * @property {number} columnNumber - Column Number
 * @property {number} lineNumber - Line Number
 */

/**
 * @typedef {Object} DataType
 * @property {string[]} images - List of Image file names with Extensions
 * @property {string} audio - Audio File Name with Extension
 * @property {number} duration - Duration in miliseconds
 * @property {Caption[]} [caption] - Array of Captions
 */

/**
 * @typedef {Object} DataContent
 * @property {DataType} data - The Main Object which Contains Object
 */
