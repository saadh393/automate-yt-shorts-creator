import { useState, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

import { Copy, Save, MessageSquare, Sparkles } from "lucide-react";

const PLACEHOLDER_REGEX = /\[([a-zA-Z0-9_]+)(?::([^\]:]+))?(?::([0-9]+)-([0-9]+))?(?:\{([^\}]+)\})?\]/g;

function parsePlaceholders(prompt) {
  // Returns array of {name, type, min, max, options}
  const matches = [];
  let m;
  while ((m = PLACEHOLDER_REGEX.exec(prompt))) {
    const [full, name, type, min, max, options] = m;
    let opts = undefined;
    if (options) {
      opts = options.split(",").map((s) => s.trim().replace(/^'|'$/g, ""));
    }
    matches.push({
      name,
      type: type || (opts ? "select" : "string"),
      min: min ? Number(min) : undefined,
      max: max ? Number(max) : undefined,
      options: opts,
      raw: full,
    });
  }
  return matches;
}

export default function PromptFillerPage() {
  const [prompt, setPrompt] = useState("");
  const [values, setValues] = useState({});
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const placeholders = useMemo(() => parsePlaceholders(prompt), [prompt]);

  useEffect(() => {
    // On mount, load last template or empty
    let templates = [];
    try {
      templates = JSON.parse(localStorage.getItem("promptTemplates") || "[]");
    } catch {
      templates = [];
    }
    if (templates.length > 0) {
      setPrompt(templates[0]);
    } else {
      setPrompt("");
    }
    setTemplates(templates);
  }, []);

  function handleValueChange(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function renderInput(ph) {
    if (ph.options && ph.options.length) {
      return (
        <Select value={values[ph.name] || ""} onValueChange={(val) => handleValueChange(ph.name, val)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={`Select ${ph.name}`} />
          </SelectTrigger>
          <SelectContent>
            {ph.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    if (ph.type === "number" && ph.min !== undefined && ph.max !== undefined) {
      return (
        <div className="flex items-center gap-2 w-60">
          <Slider
            min={ph.min}
            max={ph.max}
            value={[Number(values[ph.name]) || ph.min]}
            onValueChange={([val]) => handleValueChange(ph.name, val)}
            step={1}
          />
          <Input
            type="number"
            min={ph.min}
            max={ph.max}
            value={values[ph.name] ?? ""}
            onChange={(e) => handleValueChange(ph.name, e.target.value)}
            className="w-16"
          />
        </div>
      );
    }
    if (ph.type === "number") {
      return (
        <Input
          type="number"
          value={values[ph.name] ?? ""}
          onChange={(e) => handleValueChange(ph.name, e.target.value)}
          className="w-40"
        />
      );
    }
    // Default to text
    return (
      <Input
        type="text"
        value={values[ph.name] ?? ""}
        onChange={(e) => handleValueChange(ph.name, e.target.value)}
        className="w-40"
      />
    );
  }

  function getPreview() {
    let out = prompt;
    for (const ph of placeholders) {
      const val = values[ph.name];
      out = out.replaceAll(ph.raw, val !== undefined && val !== "" ? val : `[${ph.name}]`);
    }
    return out;
  }

  // Save template to localStorage (max 10)
  function handleSaveTemplate() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error("Prompt is empty. Cannot save.");
      return;
    }
    let templates = [];
    try {
      templates = JSON.parse(localStorage.getItem("promptTemplates") || "[]");
    } catch {
      templates = [];
    }
    templates = templates.filter((t) => t !== trimmedPrompt);
    templates.unshift(trimmedPrompt);
    if (templates.length > 10) templates = templates.slice(0, 10);
    localStorage.setItem("promptTemplates", JSON.stringify(templates));
    setTemplates(templates);
    setPrompt(trimmedPrompt); // Always pick the saved one
    toast.success("Template saved!");
  }

  // Validation: check if all placeholders are filled
  function validatePlaceholders() {
    for (const ph of placeholders) {
      const val = values[ph.name];
      if (val === undefined || val === "") {
        return false;
      }
    }
    return true;
  }

  // Copy prompt to clipboard
  function handleCopyPrompt() {
    if (!validatePlaceholders()) {
      toast.error("Please fill all dynamic values before copying.");
      return;
    }
    const text = getPreview();
    navigator.clipboard.writeText(text).then(
      () => toast.success("Prompt copied!"),
      () => toast.error("Failed to copy.")
    );
  }

  // Open in ChatGPT
  function handleOpenChatGPT() {
    if (!validatePlaceholders()) {
      toast.error("Please fill all dynamic values before opening in ChatGPT.");
      return;
    }
    const text = getPreview();
    const url = `https://chat.openai.com/?q=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  // Pick template from list
  function handlePickTemplate(tmpl) {
    setPrompt(tmpl);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1 tracking-tight flex items-center gap-2"><Sparkles /> <span>Prompt Filler</span></h2>
        <p className="text-muted-foreground mb-4 text-base">Paste your prompt below. Dynamic placeholders will be detected and editable below.</p>
        <div className="flex gap-2 mb-2">
          {templates.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates((v) => !v)}
              className="text-xs"
            >
              Show Saved Templates
            </Button>
          )}
        </div>
        {showTemplates && templates.length > 0 && (
          <div className="mb-4 border rounded-lg bg-card/70 p-3 flex flex-col gap-2">
            {templates.map((tmpl, i) => (
              <Button
                key={tmpl + i}
                variant={tmpl === prompt ? "default" : "secondary"}
                size="sm"
                className="justify-start text-left"
                onClick={() => handlePickTemplate(tmpl)}
              >
                {tmpl.length > 80 ? tmpl.slice(0, 80) + "..." : tmpl}
              </Button>
            ))}
          </div>
        )}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="font-mono text-base mb-6 border-muted bg-background/80 shadow-sm focus:ring-2 focus:ring-primary"
          placeholder="Paste your prompt here..."
        />
      </div>
      {placeholders.length > 0 && (
        <div className="mb-10 rounded-lg border bg-card/60 p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg text-primary">Fill Placeholders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placeholders.map((ph) => (
              <div key={ph.raw} className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-muted-foreground mb-1 capitalize">{ph.name}</Label>
                {renderInput(ph)}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-primary">Live Preview</h3>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={handleSaveTemplate} title="Save as Template">
              <Save className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCopyPrompt} title="Copy Prompt">
              <Copy className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleOpenChatGPT} title="Open in ChatGPT">
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="prose prose-invert bg-zinc-800/60 rounded-lg p-6 border shadow-sm min-h-[120px]">
          <ReactMarkdown>
            {getPreview()}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

