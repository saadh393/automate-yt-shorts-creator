import { createImageUrl, generateRandomSeed } from "./image-utils";

export default async function prepareApiCall(prompt, params, count = 10) {
  return await Promise.all(
    Array(params.imageCount || count)
      .fill(null)
      .map(async () => {
        const uniqueSeed = generateRandomSeed();
        const baseParams = { ...params, seed: uniqueSeed };
        return {
          url: createImageUrl(prompt, baseParams, params.width || 1024, params.height || 1024),
          seed: uniqueSeed,
          prompt: prompt,
          config: baseParams,
        };
      })
  );
}
