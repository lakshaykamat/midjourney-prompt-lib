import { useState } from "react";

export default function CopyPromptButton({ promptText }: { promptText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-block mt-4 px-5 py-3 rounded-lg font-semibold transition ${
        copied
          ? "bg-green-500 text-white"
          : "bg-white text-black hover:bg-zinc-200"
      }`}
    >
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}