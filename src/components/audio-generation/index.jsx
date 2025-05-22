import generateAudio from "@/api/generate-audio";
import { useApp } from "@/context/app-provider";
import { Label } from "@radix-ui/react-label";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Wave from "../wave";

export default function AudioGeneration() {
  const { setAudioText, audioText, setUploadId, setConfig, uploadId } = useApp();
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    setUploadId("");
    setConfig((pre) => {
      return { ...pre, audio: "generate" };
    });
  }, []);

  async function handlePlay() {
    try {
      const audioRef = await generateAudio(audioText);
      setAudioSrc(audioRef);
    } catch (error) {
      setAudioSrc(null);
      toast.error(error);
    }
  }

  return (
    <div className="space-y-3">
      <div className="max-w-2xl mx-auto space-y-1">
        <Label className="text-neutral-500 text-sm mb-2">{"File ID"}</Label>

        <Input
          value={uploadId == null ? "" : uploadId}
          onChange={(e) => setUploadId(e.target.value)}
          placeholder="Type your message here."
          rows={6}
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-1">
        <Label className="text-neutral-500 text-sm mb-2">{"Write your text to generate Audio"}</Label>

        <Textarea
          value={audioText}
          onChange={(e) => setAudioText(e.target.value)}
          placeholder="Your Narration to generate Audio"
          rows={6}
        />
      </div>

      {audioSrc && (
        <>
          <AudioPlayer audioSrc={audioSrc} />
          <div className="mx-auto text-center my-4 space-x-4">
            <DownloadButton audioSrc={audioSrc} fileId={uploadId} />
          </div>
        </>
      )}

      {/* <KokoroTTS /> */}
      <div className="mx-auto text-center my-4 space-x-4">
        <Button variant="outline" disabled={!audioText?.length} onClick={handlePlay}>
          <Play /> Generate & Play
        </Button>
      </div>
    </div>
  );
}

function AudioPlayer({ audioSrc }) {
  const audioRef = useRef();
  const [playerState, setPlayerState] = useState(false);

  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.play();
      setPlayerState(true);
    }
  }, [audioSrc]);

  useEffect(() => {
    function audioEndListeer() {
      setPlayerState(false);
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", audioEndListeer);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", audioEndListeer);
      }
    };
  }, [playerState]);

  function handlePlayPause() {
    if (playerState) {
      audioRef.current.pause();
      setPlayerState(false);
    } else {
      audioRef.current.play();
      setPlayerState(true);
    }
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-neutral-800 border border-neutral-700 p-6 m-4 rounded-xl relative min-h-28 flex items-center gap-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Button
          variant={playerState ? "destructive" : "success"}
          onClick={handlePlayPause}
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {!playerState ? (
            <span className="material-icons text-2xl">▶️</span>
          ) : (
            <span className="material-icons text-2xl">⏸️</span>
          )}
        </Button>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-white mb-1">Audio Preview</span>
          <span className="text-xs text-neutral-400">{playerState ? "Playing..." : "Paused"}</span>
        </div>
      </div>
      <audio ref={audioRef} src={audioSrc} controls className="hidden" />
      <div className="flex-1 flex items-center">{playerState && <Wave />}</div>
    </div>
  );
}

function DownloadButton({ audioSrc, fileId }) {
  function handleDownload() {
    const link = document.createElement("a");
    link.href = audioSrc;
    const now = new Date();
    const defaultName =
      "untitled-" +
      now.getFullYear() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      "-" +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0") +
      ".mp3";
    link.download = fileId && fileId.trim() !== "" ? fileId + ".mp3" : defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <Button variant="secondary" onClick={handleDownload} className="ml-2">
      Download
    </Button>
  );
}
