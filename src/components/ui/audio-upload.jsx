import { useState, useRef } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function AudioUpload({ onAudioSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    setAudioFile(file);
    onAudioSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          isDragging ? "border-primary bg-primary/10" : "border-border",
          "transition-colors duration-200"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={handleFileInput} />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload Audio</h3>
          {audioFile ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Selected: {audioFile.name}</p>
              <audio controls className="w-full">
                <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
                Your browser does not support the audio element.
              </audio>
              <Button
                variant="outline"
                onClick={() => {
                  setAudioFile(null);
                  onAudioSelect(null);
                }}
              >
                Remove Audio
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Drag and drop your audio file here, or click to select</p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Select Audio File
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
