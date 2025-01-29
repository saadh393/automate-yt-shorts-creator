import { Button } from "./button";

export default function PromptSubmit({ onClick, disabled }) {
  return (
    <Button
      className="mx-auto my-4 block"
      onClick={onClick}
      disabled={disabled}
    >
      Generate Image
    </Button>
  );
}
