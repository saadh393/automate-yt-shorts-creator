import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Card from "../Card";

export default function AudioContent() {
  const [textPrompt, setTextPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAudio = async () => {
    if (!textPrompt.trim()) {
      setError("Please enter some text");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://874b-34-125-198-142.ngrok-free.app/generate_audio/?text_prompt=${encodeURIComponent(
          textPrompt
        )}&history_prompt=v2/en_speaker_1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `text_prompt=${encodeURIComponent(
            textPrompt
          )}&history_prompt=v2/en_speaker_1`,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      setAudioUrl(data.audio_data);
    } catch (err) {
      setError("Failed to generate audio. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter text to convert to speech..."
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          className="w-full"
        />

        <Button onClick={generateAudio} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Audio...
            </>
          ) : (
            "Generate Audio"
          )}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {audioUrl && (
        <div className="mt-4">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
