import { FormEvent, KeyboardEvent, useRef, useState } from "react";

interface BlockAIPromptProps {
  regenPrompt: string;
  onPromptUpdate: (newPrompt: string) => void;
  onRegenerate: () => void;
}

export default function BlockAIPrompt({
  regenPrompt,
  onPromptUpdate,
  onRegenerate,
}: BlockAIPromptProps) {
  const [prevRegenPrompt, setPrevRegenPrompt] = useState<string>("");

  const promptInputRef = useRef<HTMLInputElement>(null);

  // const placeholders = ["Be more concise", "Write in Spanish"];

  function handleInput(e: FormEvent<HTMLInputElement>) {
    // console.log("input!");
    onPromptUpdate(e.currentTarget.value);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onRegenerate();
    }
  }

  if (regenPrompt !== prevRegenPrompt) {
    if (promptInputRef.current) promptInputRef.current.value = regenPrompt;
    setPrevRegenPrompt(regenPrompt);
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
      ref={promptInputRef}
      type="text"
      className="aiBlockInnerHeaderInput"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      // placeholder={placeholders[getRandomInt(0, placeholders.length)]}
      placeholder="Custom instructions"
      value={regenPrompt}
    />
  );
}
