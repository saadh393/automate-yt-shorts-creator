export const generateRandomSeed = () => Math.floor(Math.random() * 1000000);

export const createImageUrl = (prompt, params, width, height) => {
  const encodedPrompt = encodeURIComponent(prompt);
  const queryParams = new URLSearchParams({
    ...params,
    width: width,
    height: height,
    nologo: params.nologo.toString(),
    enhance: params.enhance.toString(),
    safe: params.safe.toString(),
    private: params.private.toString(),
  });
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;
};
