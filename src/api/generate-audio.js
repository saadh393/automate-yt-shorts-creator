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

  const responseObj = await response.json();

  // Decode base64 audio and create a Blob URL for playback
  const audioData = Uint8Array.from(atob(responseObj.audio), c => c.charCodeAt(0));
  const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
  const audioUrl = URL.createObjectURL(audioBlob);

  return audioUrl; // Use this URL as the src for your <audio> player
}
