// import { useRef } from "react";

// import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import BlockAdd from "./BlockAdd";
import BlockMarker, { Position } from "./BlockMarker";
import { BlockInfo } from "./NoteContent";
import BlockPreview from "./BlockPreview";

interface BlockProps {
  blockIndex: number;
  text: string;
  autoFocus: boolean;
  position: Position;
  moving: boolean;
  currMovingBlock: BlockInfo;
  onTextUpdate: (blockIndex: number, newText: string) => void;
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
  currMovingBlock,
  onTextUpdate,
  onSetFocus,
  onCreateBlock,
  onMove,
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<0 | 1 | null>(null);

  const blockRef = useRef<HTMLDivElement>(null);
  const blockEditableRef = useRef<HTMLTextAreaElement>(null);

  // const blockRef = useRef(null);

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    // function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    // const target = e.target as HTMLTextAreaElement;
    // console.log("input!");

    setSize();
    onTextUpdate(blockIndex, e.target.value);
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
    console.log(currMovingBlock);
    if (currMovingBlock) {
      const top =
        currMovingBlock.position.y - currMovingBlock.position.height / 2;
      const left =
        currMovingBlock.position.x - currMovingBlock.position.width / 2;
      const right =
        currMovingBlock.position.x + currMovingBlock.position.width / 2;
      const bottom =
        currMovingBlock.position.y + currMovingBlock.position.height / 2;

      const currRect = blockRef.current.getBoundingClientRect();

      // const isOverlapping =
      //   bottom > currRect.top &&
      //   top < currRect.bottom &&
      //   right > currRect.left &&
      //   left < currRect.right;

      const isOverlapping =
        bottom > currRect.top &&
        top < currRect.bottom &&
        right > currRect.left &&
        left < currRect.right &&
        (top > currRect.top ||
          Math.abs(bottom - currRect.top) >=
            currMovingBlock.position.height / 2) &&
        (bottom < currRect.bottom ||
          Math.abs(top - currRect.bottom) >
            currMovingBlock.position.height / 2);

      if (isOverlapping) {
        const nextPreviewIndex = Number(
          left + (right - left) / 2 > currRect.width / 2
        ) as 0 | 1;
        setPreviewIndex(nextPreviewIndex);
      } else setPreviewIndex(null);

      // const createAtIndex = Number(
      //   left + (right - left) / 2 > currRect.width / 2
      // );

      // console.log("running?");

      // blockEditableRef.current.value = `${
      //   isOverlapping ? "true" : "false"
      // } ${createAtIndex}`;
    } else setPreviewIndex(null);

    // console.log("create");
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [currMovingBlock]);

  return (
    // <textarea ref={blockRef} className="block" onInput={handleInput}>
    <>
      {blockIndex === 0 ? (
        <BlockAdd createAtIndex={blockIndex} onAddBlock={handleAddBlock} />
      ) : (
        ""
      )}
      <div className={`block ${autoFocus ? "focus" : ""}`} ref={blockRef}>
        <BlockMarker
          blockIndex={blockIndex}
          onMove={onMove}
          position={position}
          moving={moving}
        />
        {previewIndex === null || !currMovingBlock ? null : (
          <BlockPreview
            previewIndex={previewIndex}
            text={currMovingBlock.text}
          />
        )}
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
          autoFocus={autoFocus}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          defaultValue={text}
          // defaultValue={previewIndex}
        />
      </div>
      <BlockAdd createAtIndex={blockIndex + 1} onAddBlock={handleAddBlock} />
    </>
  );
}
