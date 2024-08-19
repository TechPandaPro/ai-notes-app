// import { useRef } from "react";

// import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import BlockAdd from "./BlockAdd";
import BlockMarker, { Position } from "./BlockMarker";

interface BlockProps {
  blockIndex: number;
  text: string;
  autoFocus: boolean;
  position: Position;
  moving: boolean;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  onCreateBlock: (createAtIndex: number) => void;
  onMove: (blockIndex: number, position: Position) => void;
}

export default function Block({
  blockIndex,
  text,
  autoFocus,
  position,
  moving,
  onSetFocus,
  onCreateBlock,
  onMove,
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
      onCreateBlock(blockIndex + 1);
    }
  }

  function handleFocus() {
    onSetFocus(blockIndex, true);
  }

  function handleBlur() {
    onSetFocus(blockIndex, false);
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
      {blockIndex === 0 ? (
        <BlockAdd createAtIndex={blockIndex} onAddBlock={handleAddBlock} />
      ) : (
        ""
      )}
      <div className={`block ${autoFocus ? "focus" : ""}`}>
        <BlockMarker
          blockIndex={blockIndex}
          onMove={onMove}
          position={position}
          moving={moving}
        />
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
      <BlockAdd createAtIndex={blockIndex + 1} onAddBlock={handleAddBlock} />
    </>
  );
}
