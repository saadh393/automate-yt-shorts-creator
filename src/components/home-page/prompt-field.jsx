import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import Options from "@/components/home-page/Options";
import { useApp } from "@/context/app-provider";

const loadSavedOptions = () => {
  const savedOptions = localStorage.getItem("appOptions");
  return savedOptions ? JSON.parse(savedOptions) : null;
};

export default function PromptField({ onSubmit }) {
  const { handleGenerateImage, prompt, setPrompt, config, setConfig } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    handleGenerateImage();
  };

  return (
    <div className="px-4">
      <h2 className="text-sm font-medium tracking-tight my-2">Write your Prompt</h2>

      <div className="my-4">
        <Textarea placeholder="Type your prompt here." rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} />

        <Options isOpen={isOpen} setIsOpen={setIsOpen} setConfig={setConfig} config={config} />
      </div>
      <Button className="mx-auto my-4 block" onClick={handleSubmit}>
        Generate Image
      </Button>
    </div>
  );
}
