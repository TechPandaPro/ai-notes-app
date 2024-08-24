import { useEffect, useState } from "react";
import { Position } from "./BlockMarker";
import BlockGroup from "./BlockGroup";

export interface BlockInfo {
  type: string;
  text: string;
  // TODO: improve these typings
  imgUrl?: string | null;
  attemptLoad?: boolean;
  key: string;
}

interface BlockGroupBase {
  // export interface BlockGroupInfo {
  blocks: BlockInfo[];
  key: string;
  moving: boolean;
  position: Position;
  previewIndex: number | null;
}

export interface BlockGroupStatic extends BlockGroupBase {
  moving: false;
  position: null;
}

export interface BlockGroupMoving extends BlockGroupBase {
  moving: true;
  position: Exclude<Position, null>;
}

export type BlockGroupInfo = BlockGroupStatic | BlockGroupMoving;

interface FullBlockIndex {
  blockGroupIndex: number;
  blockIndex: number;
}

// TODO: add ts type for block type

export default function NoteContent() {
  const [blockGroups, setBlockGroups] = useState<BlockGroupInfo[]>([
    {
      blocks: [
        {
          type: "text",
          text: "hello, world",
          key: `${Date.now()}_0`,
        },
        {
          type: "text",
          text: "lorem ipsum",
          key: `${Date.now()}_1`,
        },
        {
          type: "text",
          text: "dolor sit amet",
          key: `${Date.now()}_2`,
        },
      ],
      key: `${Date.now()}_0`,
      position: null,
      moving: false,
      previewIndex: null,
    },
    {
      blocks: [
        {
          type: "text",
          text: "hello, world",
          key: `${Date.now()}_0`,
        },
        {
          type: "text",
          text: "lorem ipsum",
          key: `${Date.now()}_1`,
        },
      ],
      key: `${Date.now()}_1`,
      position: null,
      moving: false,
      previewIndex: null,
    },
  ]);
  const [focusIndex, setFocusIndex] = useState<FullBlockIndex | null>(null);
  const [previewIndex, setPreviewIndex] = useState<FullBlockIndex | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  function handleTypeUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    typeId: string
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].type = typeId;
    if (typeId === "image")
      nextBlockGroup.blocks[blockIndex].attemptLoad = true;
    setBlockGroups(nextBlockGroups);
    setFocusIndex({ blockGroupIndex, blockIndex });
    console.log({ blockGroupIndex, blockIndex });
  }

  function handleTextUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    newText: string
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].text = newText;
    setBlockGroups(nextBlockGroups);
  }

  function handleImageUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    imgUrl: string | null
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].imgUrl = imgUrl;
    setBlockGroups(nextBlockGroups);
  }

  function handleAttemptLoadUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    attemptLoad: boolean
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].attemptLoad = attemptLoad;
    setBlockGroups(nextBlockGroups);
  }

  function handleSetFocus(
    blockGroupIndex: number,
    blockIndex: number,
    isFocused: boolean
  ) {
    if (isFocused) setFocusIndex({ blockGroupIndex, blockIndex });
    else if (
      focusIndex && // for type checking
      blockGroupIndex === focusIndex.blockGroupIndex &&
      blockIndex === focusIndex.blockIndex
    )
      setFocusIndex(null);
  }

  function handleAddBlock(blockGroupIndex: number, createAtIndex: number) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks.splice(createAtIndex, 0, {
      type: "text",
      text: "",
      key: generateBlockKey(nextBlockGroup.blocks),
    });
    setBlockGroups(nextBlockGroups);
    setFocusIndex({ blockGroupIndex, blockIndex: createAtIndex });
  }

  function handleDeleteBlock(blockGroupIndex: number, deleteIndex: number) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks.splice(deleteIndex, 1);
    if (nextBlockGroup.blocks.length === 0)
      nextBlockGroups.splice(blockGroupIndex, 1);
    if (nextBlockGroups.length === 0) {
      const newBlockGroup: BlockGroupInfo = {
        blocks: [],
        key: generateBlockKey(blockGroups),
        position: null,
        moving: false,
        previewIndex: null,
      };
      newBlockGroup.blocks.push({
        type: "text",
        text: "",
        key: generateBlockKey(newBlockGroup.blocks),
      });
      nextBlockGroups.push(newBlockGroup);
    }
    setBlockGroups(nextBlockGroups);
  }

  function handleAddBlockGroup(createAtIndex: number) {
    setFocusIndex({ blockGroupIndex: createAtIndex, blockIndex: 0 });

    const newBlockGroup: BlockGroupInfo = {
      blocks: [],
      key: generateBlockKey(blockGroups),
      position: null,
      moving: false,
      previewIndex: null,
    };
    newBlockGroup.blocks.push({
      type: "text",
      text: "",
      key: generateBlockKey(newBlockGroup.blocks),
    });

    const nextBlockGroups = blockGroups.slice();
    nextBlockGroups.splice(createAtIndex, 0, newBlockGroup);

    setBlockGroups(nextBlockGroups);
  }

  function handleMove(blockGroupIndex: number, position: Position) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    if (position) {
      nextBlockGroup.position = position;
      nextBlockGroup.moving = true;
    } else {
      nextBlockGroup.position = null;
      nextBlockGroup.moving = false;
      if (
        previewIndex !== null &&
        nextBlockGroups[previewIndex.blockGroupIndex].blocks.length +
          nextBlockGroup.blocks.length <=
          5
      ) {
        const nextPreviewedBlock = {
          ...nextBlockGroups[previewIndex.blockGroupIndex],
        };
        nextPreviewedBlock.blocks.splice(
          previewIndex.blockIndex,
          0,
          ...nextBlockGroup.blocks
        );
        nextBlockGroups.splice(blockGroupIndex, 1);
        for (const text of nextBlockGroup.blocks)
          text.key = generateBlockKey(nextPreviewedBlock.blocks);
        setPreviewIndex(null);
      }
    }
    setBlockGroups(nextBlockGroups);
  }

  function handlePreviewIndexUpdate(
    blockGroupIndex: number,
    blockIndex: number | null
  ) {
    // console.log({ blockGroupIndex, blockIndex });
    if (blockIndex !== null) setPreviewIndex({ blockGroupIndex, blockIndex });
    else if (previewIndex && blockGroupIndex === previewIndex?.blockGroupIndex)
      setPreviewIndex(null);
  }

  function generateBlockKey(siblingBlocks: (BlockGroupInfo | BlockInfo)[]) {
    const stamp = Date.now();
    const foundCount = siblingBlocks.filter(
      (block) => block.key && block.key.startsWith(`${stamp}_`)
    ).length;
    return `${stamp}_${foundCount}`;
  }

  function handleKeyDown(e: KeyboardEvent) {
    // console.log("key pressed");
    if (e.key === "Escape") {
      e.preventDefault();
      console.log(focusIndex);
      if (focusIndex) {
        // console.log("received escape");
        setFocusIndex(null);
      } else {
        console.log("should set deleting");
        setIsDeleting(!isDeleting);
      }
    }
  }

  useEffect(() => {
    // console.log("key pressed down");
    // console.log(e.key);
    console.log("add listener!");
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusIndex, isDeleting]);

  const currMovingBlockGroup =
    blockGroups.find((blockGroup) => blockGroup.moving) ?? null;

  return (
    <div
      className={`noteContent ${currMovingBlockGroup ? "moving" : ""}`}
      // onKeyDown={handleKeyDown}
    >
      {blockGroups.map((blockGroup, blockGroupIndex) => (
        <BlockGroup
          key={blockGroup.key}
          blockGroupIndex={blockGroupIndex}
          blocks={blockGroup.blocks}
          focusBlockIndex={
            focusIndex && blockGroupIndex === focusIndex.blockGroupIndex
              ? focusIndex.blockIndex
              : null
          }
          // moving={blockGroup.moving}
          // position={blockGroup.position}
          {...(blockGroup.moving
            ? {
                moving: true as const,
                position: blockGroup.position as Exclude<Position, null>,
              }
            : { moving: false as const, position: null })}
          currMovingBlockGroup={
            !blockGroup.moving ? currMovingBlockGroup : null
            // !blockGroup.moving
            //   ? currMovingBlockGroup &&
            //     blockGroup.blocks.length + currMovingBlockGroup.blocks.length <= 5
            //     ? currMovingBlockGroup
            //     : null
            //   : null
          }
          invalidMove={
            !!(
              !blockGroup.moving &&
              currMovingBlockGroup &&
              blockGroup.blocks.length + currMovingBlockGroup.blocks.length > 5
            )
            // currMovingBlockGroup &&
            // previewIndex &&
            // blockGroupIndex === previewIndex.blockGroupIndex &&
            // blockGroup.blocks.length + currMovingBlockGroup.blocks.length > 5
            //   ? true
            //   : false
          }
          previewIndex={
            previewIndex && blockGroupIndex === previewIndex.blockGroupIndex
              ? previewIndex.blockIndex
              : null
          }
          isDeleting={isDeleting}
          onTypeUpdate={handleTypeUpdate}
          onTextUpdate={handleTextUpdate}
          onImageUpdate={handleImageUpdate}
          onAttemptLoadUpdate={handleAttemptLoadUpdate}
          onSetFocus={handleSetFocus}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onAddBlockGroup={handleAddBlockGroup}
          onMove={handleMove}
          onPreviewIndexUpdate={handlePreviewIndexUpdate}
        />
      ))}
    </div>
  );
}
