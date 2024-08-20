import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

interface BlockProps {
  blockIndex: number;
  text: string;
  isFocused: boolean;
  onTextUpdate: (blockIndex: number, newText: string) => void;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  onAddBlock: (createAtIndex: number) => void;
}

export default function Block({
  blockIndex,
  text,
  isFocused,
  onTextUpdate,
  onSetFocus,
  onAddBlock,
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  const blockEditableRef = useRef<HTMLTextAreaElement>(null);

  // function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    // function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    // const target = e.target as HTMLTextAreaElement;
    // console.log("input!");

    setSize();
    onTextUpdate(blockIndex, e.target.value);
  }

  function handleFocus() {
    onSetFocus(blockIndex, true);
  }

  function handleBlur() {
    onSetFocus(blockIndex, false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddBlock(blockIndex + 1);
    }
  }

  function setSize() {
    const block = blockEditableRef.current;
    // TODO: consider using invisible div to measure this. that way the dom that react manages won't be manipulated
    const oldHeight = block.style.height;
    block.style.height = "0";
    block.offsetHeight;
    setBlockHeight(block.scrollHeight);
    if (oldHeight) block.style.setProperty("height", oldHeight);
    else block.style.removeProperty("height");
  }

  useEffect(() => {
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  return (
    <textarea
      ref={blockEditableRef}
      style={{
        height: blockHeight,
        // backgroundColor: autoFocus ? "blue" : "transparent",
      }} /* numbers are automatically converted to px */
      rows={
        1
      } /* this will be overriden by the style prop when the textarea has a value */
      className="blockEditable"
      defaultValue={text}
      autoFocus={isFocused}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // defaultValue={previewIndex}
    />
  );
}
