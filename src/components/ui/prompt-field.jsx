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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { ChevronDown } from "lucide-react";

const ASPECT_RATIOS = [
  { name: "Square (1:1)", width: 1024, height: 1024 },
  { name: "Portrait (9:16)", width: 1080, height: 1920 },
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
  const [selectedRatio, setSelectedRatio] = useState("Portrait (9:16)");
  const [customDimensions, setCustomDimensions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between py-2 ">
            <Label className="text-xs font-medium">Advanced Options</Label>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aspect-ratio" className="text-xs">
                  Aspect Ratio
                </Label>
                <Select
                  className="text-xs"
                  value={selectedRatio}
                  onValueChange={handleRatioChange}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select aspect ratio"
                      className="text-xs"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((ratio) => (
                      <SelectItem
                        className="text-xs"
                        key={ratio.name}
                        value={ratio.name}
                      >
                        {ratio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Model</Label>
                <Select
                  className="text-xs"
                  value={config.model}
                  onValueChange={(value) =>
                    setConfig((prev) => ({ ...prev, model: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select model"
                      className="text-xs"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((model) => (
                      <SelectItem
                        className="text-xs"
                        key={model.value}
                        value={model.value}
                      >
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs" htmlFor="custom-dimensions">
                    Custom Dimensions
                  </Label>
                  <Switch
                    className="text-xs"
                    id="custom-dimensions"
                    size="sm"
                    checked={customDimensions}
                    onCheckedChange={setCustomDimensions}
                  />
                </div>
                {customDimensions && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs" htmlFor="width">
                        Width
                      </Label>
                      <Input
                        className="text-xs"
                        size="sm"
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

              <div className="space-y-2 flex items-center justify-between">
                <Label className="text-xs" htmlFor="seed">
                  Seed
                </Label>
                <Input
                  className="text-xs  w-1/2"
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

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    className="text-xs scale-75"
                    id="nologo"
                    checked={config.nologo}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, nologo: checked }))
                    }
                  />
                  <Label className="text-xs" htmlFor="nologo">
                    No Logo
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enhance"
                    className="text-xs scale-75"
                    checked={config.enhance}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, enhance: checked }))
                    }
                  />
                  <Label htmlFor="enhance" className="text-xs">
                    Enhance Quality
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="safe"
                    checked={config.safe}
                    className="text-xs scale-75"
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, safe: checked }))
                    }
                  />
                  <Label htmlFor="safe" className="text-xs">
                    Safe Mode
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    className="text-xs scale-75"
                    checked={config.private}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, private: checked }))
                    }
                  />
                  <Label htmlFor="private" className="text-xs">
                    Private Mode
                  </Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <Button className="mx-auto my-4 block" onClick={handleSubmit}>
        Generate Image
      </Button>
    </div>
  );
}
