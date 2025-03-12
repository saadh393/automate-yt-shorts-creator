export const generateRandomSeed = () => Math.floor(Math.random() * 1000000);

const randomImages = [
  `https://image.pollinations.ai/prompt/a%20modern%20sculpture%20of%20an%20ancient%20tripod%20holding%20a%20futuristic%20earth%20model,%20made%20of%20metallic%20gray%20and%20gold%20gradient,%20with%20blue%20glass%20and%20LED%20lights,%20inscribed%20with%20Davos%20declaration%20and%20Belt%20and%20Road%20slogans,%20set%20in%20a%20busy%20city%20square%20with%20skyscrapers%20and%20city%20lights?width=1024&height=1024&seed=100&model=flux&nologo=true`,
  `https://image.pollinations.ai/prompt/Glass%20patio%20cover?width=1080&height=720&seed=65&enhance=true&nologo=true&model=flux-realism`,
];

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

  const random = Math.round(Math.random() * 100) % (randomImages.length - 1);
  return randomImages[random];
};
