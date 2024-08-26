// import { useEffect, useRef, useState } from "react";
import { useEffect, useRef } from "react";
import BlockAdd from "./BlockAdd";
import BlockMarker, { Position } from "./BlockGroupMarker";
import {
  BlockGroupInfoMoving,
  BlockInfo,
  BlockInfoMoving,
  FullBlockIndex,
} from "./NoteContent";
import Block from "./Block";
import BlockGroupPreview from "./BlockGroupPreview";
import { BlockType } from "./BlockTypeOption";

// TODO: content should auto-scroll when dragging for block group move

interface BlockGroupPropsBase {
  // interface BlockGroupProps {
  blockGroupIndex: number;
  blocks: BlockInfo[];
  focusBlockIndex: number | null;
  moving: boolean;
  position: Position;
  currMovingBlock: BlockInfoMoving | null;
  currMovingBlockIndex: FullBlockIndex | null;
  currMovingBlockGroup: BlockGroupInfoMoving | null;
  invalidMove: boolean;
  previewIndex: number | null;
  isDeleting: boolean;
  onTypeUpdate: (
    blockGroupIndex: number,
    blockIndex: number,
    type: BlockType
  ) => void;
  onTextUpdate: (
    blockGroupIndex: number,
    blockIndex: number,
    newText: string
  ) => void;
  onImageUpdate: (
    blockGroupIndex: number,
    blockIndex: number,
    imgUrl: string | null
  ) => void;
  onAttemptLoadUpdate: (
    blockGroupIndex: number,
    blockIndex: number,
    attemptLoad: boolean
  ) => void;
  onSetFocus: (
    blockGroupIndex: number,
    blockIndex: number,
    isFocused: boolean
  ) => void;
  // onSetMoving: (
  //   blockGroupIndex: number,
  //   blockIndex: number,
  //   isFocused: boolean
  // ) => void;
  onAddBlock: (blockGroupIndex: number, createAtIndex: number) => void;
  onDeleteBlock: (blockGroupIndex: number, deleteIndex: number) => void;
  onAddBlockGroup: (createAtIndex: number) => void;
  onBlockMove: (
    blockGroupIndex: number,
    blockIndex: number,
    position: Position
  ) => void;
  onBlockGroupMove: (blockGroupIndex: number, position: Position) => void;
  onBlockGroupCancelMove: (blockGroupIndex: number) => void;
  onMovingBlockUpdate: (
    blockGroupIndex: number,
    blockIndex: number,
    movedToBlockGroupIndex: number,
    movedToBlockIndex: number
  ) => void;
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
  blocks,
  focusBlockIndex,
  position,
  moving,
  currMovingBlock,
  currMovingBlockIndex,
  currMovingBlockGroup,
  invalidMove,
  previewIndex,
  isDeleting,
  onTypeUpdate,
  onTextUpdate,
  onImageUpdate,
  onAttemptLoadUpdate,
  onSetFocus,
  // onSetMoving,
  onAddBlock,
  onDeleteBlock,
  onAddBlockGroup,
  onBlockMove,
  onBlockGroupMove,
  onBlockGroupCancelMove,
  onMovingBlockUpdate,
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

  function handleTypeUpdate(blockIndex: number, type: BlockType) {
    onTypeUpdate(blockGroupIndex, blockIndex, type);
  }

  function handleTextUpdate(blockIndex: number, newText: string) {
    onTextUpdate(blockGroupIndex, blockIndex, newText);
  }

  function handleImageUpdate(blockIndex: number, imgUrl: string | null) {
    onImageUpdate(blockGroupIndex, blockIndex, imgUrl);
  }

  function handleAttemptLoadUpdate(blockIndex: number, attemptLoad: boolean) {
    onAttemptLoadUpdate(blockGroupIndex, blockIndex, attemptLoad);
  }

  function handleSetFocus(blockIndex: number, isFocused: boolean) {
    onSetFocus(blockGroupIndex, blockIndex, isFocused);
  }

  // function handleSetMoving(blockIndex: number, isMoving: boolean) {
  //   onSetMoving(blockGroupIndex, blockIndex, isMoving);
  // }

  function handleMove(blockIndex: number, position: Position) {
    onBlockMove(blockGroupIndex, blockIndex, position);
  }

  function handleAddBlock(createAtIndex: number) {
    onAddBlock(blockGroupIndex, createAtIndex);
  }

  function handleDeleteBlock(deleteIndex: number) {
    onDeleteBlock(blockGroupIndex, deleteIndex);
  }

  function handleAddBlockGroup(createAtIndex: number) {
    onAddBlockGroup(createAtIndex);
  }

  function handleAddBlockGroupFromBlock() {
    onAddBlockGroup(blockGroupIndex + 1);
  }

  useEffect(() => {
    if (
      currMovingBlock &&
      currMovingBlockIndex &&
      blockGroupRef.current &&
      (!currMovingBlock ||
        blocks.includes(currMovingBlock) ||
        blocks.length < 5)
    ) {
      const { x, y } = currMovingBlock.position;
      const blockGroupRect = blockGroupRef.current.getBoundingClientRect();
      const isOverlapping =
        x > blockGroupRect.left &&
        x < blockGroupRect.right &&
        y > blockGroupRect.top &&
        y < blockGroupRect.bottom;
      if (isOverlapping) {
        const placementOptionsCount = blocks.length;
        const movedToBlockIndex = Math.floor(
          (x / blockGroupRect.width) * placementOptionsCount
        );

        // onMovingBlockUpdate: (
        //   blockGroupIndex: number,
        //   blockIndex: number,
        //   movedToBlockGroupIndex: number,
        //   movedToBlockIndex: number
        // ) => void;

        // onPreviewIndexUpdate(blockGroupIndex, nextPreviewIndex);
        if (
          currMovingBlockIndex.blockGroupIndex !== blockGroupIndex ||
          currMovingBlockIndex.blockIndex !== movedToBlockIndex
        )
          onMovingBlockUpdate(
            currMovingBlockIndex.blockGroupIndex,
            currMovingBlockIndex.blockIndex,
            blockGroupIndex,
            movedToBlockIndex
          );
        // } else onPreviewIndexUpdate(blockGroupIndex, null);
      }
      // } else onMovingBlockUpdate(blockGroupIndex, null);
      // } else onPreviewIndexUpdate(blockGroupIndex, null);
    }
    // } else onMovingBlockUpdate(blockGroupIndex, null);
  }, [currMovingBlock]);

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
        const placementOptionsCount = blocks.length + 1;
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

  /* even invalid previews are still added. such previews
   * are considered "failed" and are hidden by the CSS */
  const doAddPreview = previewIndex !== null && currMovingBlockGroup;

  // const blockComponents = (
  //   currMovingBlockGroup && !("blocks" in currMovingBlockGroup)
  //     ? blocks.filter((block) => currMovingBlockGroup !== block)
  //     : blocks
  // ).map((block, blockIndex) => (
  const blockComponents = blocks.map((block, blockIndex) => (
    <Block
      key={block.key}
      blockIndex={blockIndex}
      type={block.type}
      text={block.text}
      imgUrl={block.imgUrl}
      attemptLoad={block.attemptLoad ?? false}
      siblingCount={
        blocks.length -
        1 +
        (doAddPreview ? currMovingBlockGroup.blocks.length : 0)
        // (doAddPreview
        //   ? "blocks" in currMovingBlockGroup
        //     ? currMovingBlockGroup.blocks.length
        //     : 1
        //   : 0)
      }
      isFocused={focusBlockIndex === blockIndex}
      isMoving={block.moving}
      isDeleting={isDeleting}
      // moving={block.moving}
      onTypeUpdate={handleTypeUpdate}
      onTextUpdate={handleTextUpdate}
      onImageUpdate={handleImageUpdate}
      onAttemptLoadUpdate={handleAttemptLoadUpdate}
      onSetFocus={handleSetFocus}
      // onSetMoving={handleSetMoving}
      onMove={handleMove}
      onAddBlock={handleAddBlock}
      onDeleteBlock={handleDeleteBlock}
      onAddBlockGroup={handleAddBlockGroupFromBlock}
    />
  ));

  if (doAddPreview)
    // if (!invalidMove && previewIndex !== null && currMovingBlockGroup)
    blockComponents.splice(
      previewIndex,
      0,
      <BlockGroupPreview
        key={`${currMovingBlockGroup.key}_preview`}
        blocks={
          // "blocks" in currMovingBlockGroup
          //   ? currMovingBlockGroup.blocks
          //   : [currMovingBlockGroup]
          currMovingBlockGroup.blocks
        }
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

  // console.log(isDeleting);

  return (
    <>
      {!isDeleting && blockGroupIndex === 0 ? (
        <BlockAdd
          createAtIndex={blockGroupIndex}
          onAddBlock={handleAddBlockGroup}
        />
      ) : (
        ""
      )}
      <div
        className={`blockGroup ${focusBlockIndex !== null ? "focus" : ""} ${
          invalidMove ? "invalidMove" : ""
        } ${doAddPreview && invalidMove ? "failMove" : ""}`}
        ref={blockGroupRef}
      >
        <BlockMarker
          blockGroupIndex={blockGroupIndex}
          onMove={onBlockGroupMove}
          onCancelMove={onBlockGroupCancelMove}
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
        {blockComponents}
      </div>
      {!isDeleting ? (
        <BlockAdd
          createAtIndex={blockGroupIndex + 1}
          onAddBlock={handleAddBlockGroup}
        />
      ) : (
        ""
      )}
    </>
  );
}
