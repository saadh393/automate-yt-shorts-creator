import PageBreadcumb from "@/components/page-breadcumb";
import PageHeader from "@/components/page-header";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownTable } from "@/components/ui/markdown-table";
import { parseMarkdownTable } from "@/lib/markdown-table";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function MarkdownTablePage() {
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const [table, setTable] = useState(null);
  const [error, setError] = useState("");
  const [wrap, setWrap] = useState(false);

  function handlePasteEvent(e) {
    let pasted = "";
    if (e.clipboardData) {
      pasted = e.clipboardData.getData("text/plain");
    } else if (window.clipboardData) {
      pasted = window.clipboardData.getData("Text");
    }
    if (pasted) {
      setInput(pasted);
      parseAndSetTable(pasted);
      e.preventDefault();
    }
  }

  function handlePasteButton() {
    navigator.clipboard.readText().then((clipText) => {
      setInput(clipText);
      parseAndSetTable(clipText);
    });
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    parseAndSetTable(e.target.value);
  }

  function parseAndSetTable(md) {
    const parsed = parseMarkdownTable(md);
    if (parsed) {
      setTable(parsed);
      setError("");
    } else {
      setTable(null);
      setError(md.trim() ? "No valid markdown table found." : "");
    }
  }

  function handleTableChange(newTable) {
    setTable(newTable);
    // Optionally, update the textarea with new markdown (not required for now)
  }

  return (
    <div>
      <PageBreadcumb page="Markdown Table" />
      <div className="py-6 max-w-4xl mx-auto">
        <PageHeader
          title="Markdown Table Parser"
          subtitle="Paste markdown content below. If a table is detected, it will be rendered beautifully."
        />
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePasteButton}
              title="Paste from clipboard"
            >
              Paste
            </Button>
            <AnimatedShinyText className="ml-2">or use Ctrl+V / ⌘+V</AnimatedShinyText>
            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="wrap-toggle" className="text-xs">Wrap Columns</Label>
              <Switch
                id="wrap-toggle"
                checked={wrap}
                onCheckedChange={setWrap}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onPaste={handlePasteEvent}
            placeholder={"Paste your markdown here..."}
            rows={8}
            className="font-mono text-sm bg-background border-muted"
            spellCheck={false}
            autoFocus
          />
          {error && (
            <div className="text-destructive text-xs mt-2">{error}</div>
          )}
        </div>
      </div>

      <div className="w-full px-8 mx-auto">
        {table && <MarkdownTable table={table} wrap={wrap} onChange={handleTableChange} />}
      </div>
      {/* Toaster for notifications is assumed to be globally rendered (see ui/sonner.jsx). */}
    </div>
  );
}