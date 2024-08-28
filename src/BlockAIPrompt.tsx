import { KeyboardEvent } from "react";

interface BlockAIPromptProps {
  onRegenerate: () => void;
}

export default function BlockAIPrompt({ onRegenerate }: BlockAIPromptProps) {
  // const placeholders = ["Be more concise", "Write in Spanish"];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onRegenerate();
    }
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   * min is inclusive, max is exclusive */
  // function getRandomInt(min: number, max: number) {
  //   const minCeiled = Math.ceil(min);
  //   const maxFloored = Math.floor(max);
  //   return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  // }

  return (
    <input
      type="text"
      className="aiBlockInnerHeaderInput"
      onKeyDown={handleKeyDown}
      // placeholder={placeholders[getRandomInt(0, placeholders.length)]}
      placeholder="Custom instructions"
    />
  );
}
