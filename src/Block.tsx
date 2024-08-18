// import { useRef } from "react";

import { FormEvent, KeyboardEvent, useState } from "react";

interface BlockProps {
  text: string;
  autoFocus: boolean;
  onCreateBlock: () => void;
}

export default function Block({ text, autoFocus, onCreateBlock }: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  // const blockRef = useRef(null);

  function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLTextAreaElement;
    console.log("input!");

    // TODO: consider using invisible div to measure this. that way the dom that react manages won't be manipulated
    const oldHeight = target.style.height;
    target.style.height = "0";
    target.offsetHeight;
    setBlockHeight(target.scrollHeight);
    if (oldHeight) target.style.setProperty("height", oldHeight);
    else target.style.removeProperty("height");
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onCreateBlock();
    }
  }

  console.log(autoFocus);

  return (
    // <textarea ref={blockRef} className="block" onInput={handleInput}>
    <textarea
      style={{
        height: blockHeight,
        backgroundColor: autoFocus ? "blue" : "transparent", // TODO: remove this - it's just for testing
      }} /* numbers are automatically converted to px */
      rows={
        1
      } /* this will be overriden by the style prop when the textarea has a value */
      className="block"
      autoFocus={autoFocus}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      defaultValue={text}
    />
  );
}
