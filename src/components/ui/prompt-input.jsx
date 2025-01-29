import { Textarea } from "./textarea";

export default function PromptInput({ value, onChange }) {
  return (
    <div>
      <h2 className="scroll-m-20 text-2xl font-extrabold tracking-tight text-center">
        Write your Prompt
      </h2>
      <div className="mt-4">
        <Textarea
          placeholder="Type your prompt here."
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
