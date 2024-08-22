// import { useEffect, useRef, useState } from "react";
import { useEffect, useRef } from "react";
import BlockAdd from "./BlockAdd";
import BlockMarker, { Position } from "./BlockMarker";
import { BlockGroupMoving, BlockInfo } from "./NoteContent";
import Block from "./Block";
import BlockGroupPreview from "./BlockGroupPreview";

interface BlockGroupPropsBase {
  // interface BlockGroupProps {
  blockGroupIndex: number;
  texts: BlockInfo[];
  focusBlockIndex: number | null;
  moving: boolean;
  position: Position;
  currMovingBlockGroup: BlockGroupMoving | null;
  failMove: boolean;
  previewIndex: number | null;
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
  onPreviewIndexUpdate: (
    blockGroupIndex: number,
    previewIndex: number | null
  ) => void;
}

interface BlockGroupPropsStatic extends BlockGroupPropsBase {
  moving: false;
  position: null;
}

interface BlockGroupPropsMoving extends BlockGroupPropsBase {
  moving: true;
  position: Exclude<Position, null>;
}

type BlockGroupProps = BlockGroupPropsStatic | BlockGroupPropsMoving;

export default function BlockGroup({
  blockGroupIndex,
  texts,
  focusBlockIndex,
  position,
  moving,
  currMovingBlockGroup,
  failMove,
  previewIndex,
  onTextUpdate,
  onSetFocus,
  onCreateBlock,
  onMove,
  onPreviewIndexUpdate,
}: BlockGroupProps) {
  // decided to move this down to the jsx instead
  // const movingInfo = moving
  //   ? { moving: true as const, position: position as Exclude<Position, null> }
  //   : { moving: false as const, position: null };

  // const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const blockGroupRef = useRef<HTMLDivElement>(null);
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

  function handleAddBlock() {
    onCreateBlock(blockGroupIndex + 1);
  }

  useEffect(() => {
    // console.log(currMovingBlockGroup);
    if (currMovingBlockGroup && blockGroupRef.current) {
      const top =
        currMovingBlockGroup.position.y -
        currMovingBlockGroup.position.height / 2;
      const left =
        currMovingBlockGroup.position.x -
        currMovingBlockGroup.position.width / 2;
      const right =
        currMovingBlockGroup.position.x +
        currMovingBlockGroup.position.width / 2;
      const bottom =
        currMovingBlockGroup.position.y +
        currMovingBlockGroup.position.height / 2;

      const blockGroupRect = blockGroupRef.current.getBoundingClientRect();

      // const isOverlapping =
      //   bottom > currRect.top &&
      //   top < currRect.bottom &&
      //   right > currRect.left &&
      //   left < currRect.right;

      const isOverlapping =
        bottom > blockGroupRect.top &&
        top < blockGroupRect.bottom &&
        right > blockGroupRect.left &&
        left < blockGroupRect.right &&
        (top > blockGroupRect.top ||
          Math.abs(bottom - blockGroupRect.top) >=
            currMovingBlockGroup.position.height / 2) &&
        (bottom < blockGroupRect.bottom ||
          Math.abs(top - blockGroupRect.bottom) >
            currMovingBlockGroup.position.height / 2);

      // if (isOverlapping) {
      //   const nextPreviewIndex = Number(
      //     left + (right - left) / 2 > currRect.width / 2
      //   ) as 0 | 1;
      //   setPreviewIndex(nextPreviewIndex);
      // } else setPreviewIndex(null);

      if (isOverlapping) {
        // const placementOptionsCount =
        //   texts.length + currMovingBlockGroup.texts.length;
        const placementOptionsCount = texts.length + 1;
        const centerX = left + (right - left) / 2;
        const nextPreviewIndex = Math.floor(
          (centerX / blockGroupRect.width) * placementOptionsCount
        );
        // setPreviewIndex(nextPreviewIndex);
        onPreviewIndexUpdate(blockGroupIndex, nextPreviewIndex);
        // } else setPreviewIndex(null);
      } else onPreviewIndexUpdate(blockGroupIndex, null);

      // const createAtIndex = Number(
      //   left + (right - left) / 2 > currRect.width / 2
      // );

      // console.log("running?");

      // blockEditableRef.current.value = `${
      //   isOverlapping ? "true" : "false"
      // } ${createAtIndex}`;
      // } else setPreviewIndex(null);
    } else onPreviewIndexUpdate(blockGroupIndex, null);
  }, [currMovingBlockGroup]);

  // const displayTexts = texts.slice();

  // const displayTexts: (BlockInfo & { moving: boolean })[] = texts.map(
  //   (text) => ({ ...text, moving: false })
  // );

  // if (previewIndex !== null && currMovingBlockGroup)
  //   displayTexts.splice(
  //     previewIndex,
  //     0,
  //     ...currMovingBlockGroup.texts.map((text) => ({ ...text, moving: true }))
  //   );

  // console.log(texts);

  const blocks = texts.map((text, blockIndex) => (
    <Block
      key={text.key}
      blockIndex={blockIndex}
      text={text.text}
      isFocused={focusBlockIndex === blockIndex}
      onTextUpdate={handleTextUpdate}
      onSetFocus={handleSetFocus}
      onAddBlock={handleAddBlock}
    />
  ));

  if (previewIndex !== null && currMovingBlockGroup)
    blocks.splice(
      previewIndex,
      0,
      <BlockGroupPreview
        key={`${currMovingBlockGroup.key}_preview`}
        texts={currMovingBlockGroup.texts}
      />
    );
  // blocks.splice(
  //   previewIndex,
  //   0,
  //   <div
  //     className="blockGroupPreview"
  //     style={{ flexGrow: currMovingBlockGroup.texts.length }}
  //   >
  //     {currMovingBlockGroup.texts.map((text) => (
  //       <BlockPreview text={text} />
  //     ))}
  //   </div>
  // );

  return (
    <>
      {blockGroupIndex === 0 ? (
        <BlockAdd createAtIndex={blockGroupIndex} onAddBlock={handleAddBlock} />
      ) : (
        ""
      )}
      <div
        className={`blockGroup ${focusBlockIndex !== null ? "focus" : ""} ${
          failMove ? "failMove" : ""
        }`}
        ref={blockGroupRef}
      >
        <BlockMarker
          blockGroupIndex={blockGroupIndex}
          onMove={onMove}
          // moving={moving}
          // position={position}
          // {...{ moving, position }}
          {...(moving
            ? {
                moving: true as const,
                position: position as Exclude<Position, null>,
              }
            : { moving: false as const, position: null })}
        />
        {/* {previewIndex === null || !currMovingBlockGroup ? null : (
          <BlockPreview
            previewIndex={previewIndex}
            texts={currMovingBlockGroup.texts}
          />
        )} */}
        {/* {[
          ...texts,
          ...(previewIndex !== null && currMovingBlockGroup
            ? currMovingBlockGroup.texts
            : []),
        ].map((text, blockIndex) => ( */}
        {blocks}
      </div>
      <BlockAdd
        createAtIndex={blockGroupIndex + 1}
        onAddBlock={handleAddBlock}
      />
    </>
  );
}
