const API_ENDPOINT = "http://localhost:8880/dev/captioned_speech";
const method = "POST";
const model = "kokoro";
const voice = "am_adam";
const speed = 1;
const response_format = "mp3";
const stream = false;

export default async function generateAudio(text) {
  const input = text;
  const response = await fetch(API_ENDPOINT, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
      voice,
      speed,
      response_format,
      stream,
    }),
  });

  // Check if the response is successful
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Create a Blob from the response directly
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  return audioUrl;
}
