import { Button } from "./button";
import { Textarea } from "./textarea";
import { useState } from "react";

import Options from "./prompt/Options";
import { useApp } from "@/context/app-provider";

export default function PromptField({ onSubmit }) {
  const { handleGenerateImage } = useApp();
  const [prompt, setPrompt] = useState("");
  const [config, setConfig] = useState({
    model: "flux",
    width: 1080,
    height: 1920,
    seed: Math.floor(Math.random() * 1000000),
    nologo: true,
    enhance: true,
    safe: true,
    private: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      handleGenerateImage({ prompt, ...config });
    }
  };

  return (
    <div className="px-4">
      <h2 className="text-sm font-medium tracking-tight my-2">
        Write your Prompt
      </h2>

      <div className="my-4">
        <Textarea
          placeholder="Type your prompt here."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Options */}
        <Options
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setConfig={setConfig}
          config={config}
        />
      </div>
      <Button className="mx-auto my-4 block" onClick={handleSubmit}>
        Generate Image
      </Button>
    </div>
  );
}
