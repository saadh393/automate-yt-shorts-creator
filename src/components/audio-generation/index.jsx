import generateAudio from "@/api/generate-audio";
import { Label } from "@radix-ui/react-label";
import { Play, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Wave from "../wave";
import { useApp } from "@/context/app-provider";
import { Input } from "../ui/input";

export default function AudioGeneration() {
  const { setAudioText, audioText, setUploadId, setConfig } = useApp();
  const [audioPrompt, setAudioPrompt] = useState("");
  const [fileId, setFileId] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    setUploadId(null);
    setAudioPrompt(audioText || "");
    setAudioText();
    setConfig((pre) => {
      return { ...pre, audio: "generate" };
    });
  }, []);

  function handleDone() {
    if (!audioPrompt) {
      return toast.error("Audio Prompt can't be empty");
    }

    if (!fileId) {
      return toast.error("File id Can't be empty");
    }
    setAudioText(audioPrompt);
    setUploadId(fileId);
  }

  async function handlePlay() {
    try {
      const audioRef = await generateAudio(audioPrompt);
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

        <Input value={fileId} onChange={(e) => setFileId(e.target.value)} placeholder="Type your message here." rows={6} />
      </div>

      <div className="max-w-2xl mx-auto space-y-1">
        <Label className="text-neutral-500 text-sm mb-2">{"Write your text to generate Audio"}</Label>

        <Textarea value={audioPrompt} onChange={(e) => setAudioPrompt(e.target.value)} placeholder="Type your message here." rows={6} />
      </div>

      {audioSrc && <AudioPlayer audioSrc={audioSrc} />}

      {/* <KokoroTTS /> */}
      <div className="mx-auto text-center my-4 space-x-4">
        <Button variant="outline" disabled={!audioPrompt.length || audioText} onClick={handleDone}>
          <Save />
          Done
        </Button>
        <Button variant="outline" disabled={!audioPrompt.length} onClick={handlePlay}>
          <Play /> Generate
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

    audioRef.current.addEventListener("ended", audioEndListeer);

    return () => {
      audioRef.current.removeEventListener("ended", audioEndListeer);
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
    <div className="bg-neutral-900 border-neutral-700 p-3 m-4 rounded-md relative min-h-20">
      <audio ref={audioRef} src={audioSrc} controls className="opacity-0 absolute" />
      <Button
        variant="ghost"
        onClick={handlePlayPause}
        className="cursor-pointer  z-40 absolute top-1/2 -translate-y-1/2
      "
      >
        {!playerState ? "Play" : "Pause"}
      </Button>
      {playerState && <Wave />}
    </div>
  );
}
