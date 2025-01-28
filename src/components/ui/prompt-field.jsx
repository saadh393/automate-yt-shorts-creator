import { Button } from "./button";
import { Textarea } from "./textarea";
import { useState } from "react";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";
import { Input } from "./input";

const ASPECT_RATIOS = [
  { name: "Square (1:1)", width: 1024, height: 1024 },
  { name: "Portrait (16:9)", width: 1080, height: 1920 },
  { name: "Landscape (3:2)", width: 1536, height: 1024 },
  { name: "Wide (16:9)", width: 1920, height: 1080 },
  { name: "Custom", width: 1080, height: 1920 },
];

const MODEL_OPTIONS = [
  { value: "flux", label: "Flux" },
  { value: "turbo", label: "Turbo" },
];

export default function PromptField({ onSubmit }) {
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
  const [selectedRatio, setSelectedRatio] = useState("Portrait (16:9)");
  const [customDimensions, setCustomDimensions] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit({ prompt, ...config });
    }
  };

  const handleRatioChange = (ratio) => {
    setSelectedRatio(ratio);
    const selected = ASPECT_RATIOS.find((r) => r.name === ratio);
    if (selected && !customDimensions) {
      setConfig((prev) => ({
        ...prev,
        width: selected.width,
        height: selected.height,
      }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl text-center">
        Write your Prompt
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-center mb-4 text-foreground/50">
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </p>

      <div className="my-4">
        <Textarea
          placeholder="Type your prompt here."
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
            <Select value={selectedRatio} onValueChange={handleRatioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.name} value={ratio.name}>
                    {ratio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={config.model}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-dimensions">Custom Dimensions</Label>
              <Switch
                id="custom-dimensions"
                checked={customDimensions}
                onCheckedChange={setCustomDimensions}
              />
            </div>
            {customDimensions && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={config.width}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        width: parseInt(e.target.value),
                      }))
                    }
                    min="64"
                    max="2048"
                    step="64"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={config.height}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        height: parseInt(e.target.value),
                      }))
                    }
                    min="64"
                    max="2048"
                    step="64"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seed">Seed</Label>
            <Input
              id="seed"
              type="number"
              value={config.seed}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  seed: parseInt(e.target.value),
                }))
              }
              placeholder="Random seed for generation"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="nologo"
              checked={config.nologo}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, nologo: checked }))
              }
            />
            <Label htmlFor="nologo">No Logo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enhance"
              checked={config.enhance}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, enhance: checked }))
              }
            />
            <Label htmlFor="enhance">Enhance Quality</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="safe"
              checked={config.safe}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, safe: checked }))
              }
            />
            <Label htmlFor="safe">Safe Mode</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={config.private}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, private: checked }))
              }
            />
            <Label htmlFor="private">Private Mode</Label>
          </div>
        </div>

        <Button className="mx-auto my-4 block" onClick={handleSubmit}>
          Generate Image
        </Button>
      </div>
    </div>
  );
}
