// import { useRef } from "react";

// import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useEffect, useRef, useState } from "react";
import BlockAdd from "./BlockAdd";
import BlockMarker, { Position } from "./BlockMarker";
import { BlockGroupInfo, BlockInfo } from "./NoteContent";
import BlockPreview from "./BlockPreview";
import Block from "./Block";

interface BlockGroupProps {
  blockGroupIndex: number;
  texts: BlockInfo[];
  autoFocus: boolean;
  position: Position;
  moving: boolean;
  currMovingBlock: BlockGroupInfo;
  onTextUpdate: (
    blockGroupIndex: number,
    blockIndex: number,
    newText: string
  ) => void;
  onSetFocus: (
    blockGroupIndex: number,
    blockIndex: number,
    isFocused: boolean
  ) => void;
  onCreateBlock: (createAtIndex: number) => void;
  onMove: (blockGroupIndex: number, position: Position) => void;
}

export default function BlockGroup({
  blockGroupIndex,
  texts,
  autoFocus,
  position,
  moving,
  currMovingBlock,
  onTextUpdate,
  onSetFocus,
  onCreateBlock,
  onMove,
}: BlockGroupProps) {
  const [previewIndex, setPreviewIndex] = useState<0 | 1 | null>(null);

  const blockRef = useRef<HTMLDivElement>(null);
  // const blockEditableRef = useRef<HTMLTextAreaElement>(null);

  // function handleKeyDown(e: KeyboardEvent) {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     onCreateBlock(blockIndex + 1);
  //   }
  // }

  // function handleFocus() {
  //   onSetFocus(blockIndex, true);
  // }

  // function handleBlur() {
  //   onSetFocus(blockIndex, false);
  // }

  function handleTextUpdate(blockIndex: number, newText: string) {
    onTextUpdate(blockGroupIndex, blockIndex, newText);
  }

  function handleSetFocus(blockIndex: number, isFocused: boolean) {
    onSetFocus(blockGroupIndex, blockIndex, isFocused);
  }

  function handleAddBlock(createAtIndex: number) {
    onCreateBlock(createAtIndex);
  }

  useEffect(() => {
    // console.log(currMovingBlock);
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
  }, [currMovingBlock]);

  return (
    // <textarea ref={blockRef} className="block" onInput={handleInput}>
    <>
      {blockGroupIndex === 0 ? (
        <BlockAdd createAtIndex={blockGroupIndex} onAddBlock={handleAddBlock} />
      ) : (
        ""
      )}
      <div className={`block ${autoFocus ? "focus" : ""}`} ref={blockRef}>
        <BlockMarker
          blockGroupIndex={blockGroupIndex}
          onMove={onMove}
          position={position}
          moving={moving}
        />
        {previewIndex === null || !currMovingBlock ? null : (
          <BlockPreview
            previewIndex={previewIndex}
            texts={currMovingBlock.texts}
          />
        )}
        {texts.map((text, blockIndex) => (
          // FIXME: make sure autoFocus actually works
          <Block
            key={text.key}
            blockIndex={blockIndex}
            autoFocus={false}
            text={text.text}
            onTextUpdate={handleTextUpdate}
            onSetFocus={handleSetFocus}
            onAddBlock={handleAddBlock}
            // onCreateBlock={onCreateBlock}
          />
        ))}
      </div>
      <BlockAdd
        createAtIndex={blockGroupIndex + 1}
        onAddBlock={handleAddBlock}
      />
    </>
  );
}
