import { continueRender, delayRender, staticFile } from "remotion";

export const KomikaAxis = `TheBoldFont`;

let loaded = false;

export const loadFont = async () => {
  if (loaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  loaded = true;

  const font = new FontFace(KomikaAxis, `url('${staticFile("/KOMIKAX_.ttf")}')`);

  await font.load();
  document.fonts.add(font);

  continueRender(waitForFont);
};
