// import { useRef } from "react";

// import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import BlockAdd from "./BlockAdd";
import BlockMarker from "./BlockMarker";

interface BlockProps {
  index: number;
  text: string;
  autoFocus: boolean;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  onCreateBlock: (createAtIndex: number) => void;
}

export default function Block({
  index,
  text,
  autoFocus,
  onSetFocus,
  onCreateBlock,
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  const blockRef = useRef<HTMLTextAreaElement>(null);

  // const blockRef = useRef(null);

  function handleInput() {
    // function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    // const target = e.target as HTMLTextAreaElement;
    // console.log("input!");

    setSize();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onCreateBlock(index + 1);
    }
  }

  function handleFocus() {
    onSetFocus(index, true);
  }

  function handleBlur() {
    onSetFocus(index, false);
  }

  function handleAddBlock(createAtIndex: number) {
    onCreateBlock(createAtIndex);
  }

  function setSize() {
    // console.log("set size");
    // if (!blockRef) return;
    const block = blockRef.current;
    // TODO: consider using invisible div to measure this. that way the dom that react manages won't be manipulated
    const oldHeight = block.style.height;
    block.style.height = "0";
    block.offsetHeight;
    setBlockHeight(block.scrollHeight);
    if (oldHeight) block.style.setProperty("height", oldHeight);
    else block.style.removeProperty("height");
  }

  useEffect(() => {
    // console.log("create");
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  return (
    // <textarea ref={blockRef} className="block" onInput={handleInput}>
    <>
      {index === 0 ? (
        <BlockAdd createAtIndex={index} onAddBlock={handleAddBlock} />
      ) : (
        ""
      )}
      <div className={`block ${autoFocus ? "focus" : ""}`}>
        <BlockMarker />
        <textarea
          ref={blockRef}
          style={{
            height: blockHeight,
            // backgroundColor: autoFocus ? "blue" : "transparent",
          }} /* numbers are automatically converted to px */
          rows={
            1
          } /* this will be overriden by the style prop when the textarea has a value */
          className="blockEditable"
          autoFocus={autoFocus}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          defaultValue={text}
        />
      </div>
      <BlockAdd createAtIndex={index + 1} onAddBlock={handleAddBlock} />
    </>
  );
}
