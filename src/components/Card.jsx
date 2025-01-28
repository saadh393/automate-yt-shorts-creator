import {
  ExternalLinkIcon,
  LucideExpand,
  LucideListCollapse,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function Card() {
  const [optionVisible, toggleOption] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [audioNarration, setAudioNarration] = useState("");
  const [options, setOptions] = useState({
    model: "flux",
    width: 512,
    height: 512,
    nologo: true,
    enhance: true,
    safe: true,
  });

  function generateImage() {}

  function getPopularMovies(){
    // Response
  }

  return (
    <div className="grid grid-cols-12 gap-4 max-w-5xl mx-auto my-6 p-6 border rounded-md hover:bg-zinc-50">
      <div className="col-span-9">
       
        {/* Image Prompt */}
        <div className="space-y-2">
          <label className="text-sm select-none">Image Prompt</label>
          <Textarea
            placeholder="Image Prompt"
            className="w-full text-sm "
            rows="4"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value.trim())}
          />
          <div className="space-x-4">
            <Button size="sm" disabled={!Boolean(imagePrompt)}>
              <ExternalLinkIcon /> Generate
            </Button>
            <Button size="sm" onClick={() => toggleOption(!optionVisible)}>
              {optionVisible ? (
                <>
                  <LucideListCollapse /> Hide Options
                </>
              ) : (
                <>
                  <LucideExpand /> Show Options
                </>
              )}
            </Button>
          </div>
          {optionVisible && (
            <ImageOptions options={options} setOption={setOptions} />
          )}
        </div>

        {/* Audio Narration */}
        <div className="mt-2">
          <label className="text-sm select-none">Audio Narration</label>
          <Textarea
            placeholder="Narration"
            className="w-full text-sm"
            rows="4"
            value={audioNarration}
            onChange={(e) => setAudioNarration(e.target.value.trim())}
          />
        </div>
      </div>
      <div className="col-span-3 ">
        <img
          src="/5.jpeg"
          className="w-full max-w-48 rounded-md object-contain mx-auto border"
        />
      </div>
    </div>
  );
}

function ImageOptions({ options, setOption }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg mb-6 text-xs border overflow-hidden">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          value={options.model}
          className="w-full p-1 border border-gray-300 rounded-md"
        >
          <option value="flux">Flux</option>
          <option value="sdxl">SDXL</option>
          <option value="kandinsky">Kandinsky</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Size
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={options.width}
            className="w-full p-1 border border-gray-300 rounded-md"
            placeholder="Width"
          />
          <input
            type="number"
            value={options.height}
            className="w-full p-1 border border-gray-300 rounded-md"
            placeholder="Height"
          />
        </div>
      </div>
      <div className="col-span-2 flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.enhance}
            className="rounded text-indigo-600"
          />
          <span className="text-xs text-gray-700">Enhance Quality</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.safe}
            className="rounded text-indigo-600"
          />
          <span className="text-xs text-gray-700">Safe Mode</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.nologo}
            className="rounded text-indigo-600"
          />
          <span className="text-xs text-gray-700">No Logo</span>
        </label>
      </div>
    </div>
  );
}
