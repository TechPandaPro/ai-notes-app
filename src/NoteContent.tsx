import { useEffect, useState } from "react";
import { Position } from "./BlockGroupMarker";
import BlockGroup from "./BlockGroup";
import { BlockType } from "./BlockTypeOption";

interface BlockInfoBase {
  type: BlockType;
  text: string;
  // TODO: improve these typings
  imgUrl?: string | null;
  attemptLoad?: boolean;
  key: string;
  moving: boolean;
  position: Position;
  previewIndex: number | null;
}

export interface BlockInfoStatic extends BlockInfoBase {
  moving: false;
  position: null;
  previewIndex: null;
}

export interface BlockInfoMoving extends BlockInfoBase {
  moving: true;
  position: Exclude<Position, null>;
  previewIndex: number;
}

export type BlockInfo = BlockInfoStatic | BlockInfoMoving;

interface BlockGroupInfoBase {
  // export interface BlockGroupInfo {
  blocks: BlockInfo[];
  key: string;
  moving: boolean;
  position: Position;
  previewIndex: number | null;
}

export interface BlockGroupInfoStatic extends BlockGroupInfoBase {
  moving: false;
  position: null;
  previewIndex: null;
}

export interface BlockGroupInfoMoving extends BlockGroupInfoBase {
  moving: true;
  position: Exclude<Position, null>;
  previewIndex: number;
}

export type BlockGroupInfo = BlockGroupInfoStatic | BlockGroupInfoMoving;

interface FullBlockIndex {
  blockGroupIndex: number;
  blockIndex: number;
}

export default function NoteContent() {
  const [blockGroups, setBlockGroups] = useState<BlockGroupInfo[]>([
    {
      blocks: [
        {
          type: BlockType.Text,
          text: "hello, world",
          key: `${Date.now()}_0`,
          moving: false,
          position: null,
          previewIndex: null,
        },
        {
          type: BlockType.Text,
          text: "lorem ipsum",
          key: `${Date.now()}_1`,
          moving: false,
          position: null,
          previewIndex: null,
        },
        {
          type: BlockType.Text,
          text: "dolor sit amet",
          key: `${Date.now()}_2`,
          moving: false,
          position: null,
          previewIndex: null,
        },
      ],
      key: `${Date.now()}_0`,
      moving: false,
      position: null,
      previewIndex: null,
    },
    {
      blocks: [
        {
          type: BlockType.Text,
          text: "hello, world",
          key: `${Date.now()}_0`,
          moving: false,
          position: null,
          previewIndex: null,
        },
        {
          type: BlockType.Text,
          text: "lorem ipsum",
          key: `${Date.now()}_1`,
          moving: false,
          position: null,
          previewIndex: null,
        },
      ],
      key: `${Date.now()}_1`,
      moving: false,
      position: null,
      previewIndex: null,
    },
  ]);
  const [focusIndex, setFocusIndex] = useState<FullBlockIndex | null>(null);
  const [previewIndex, setPreviewIndex] = useState<FullBlockIndex | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  function handleTypeUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    type: BlockType
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].type = type;
    if (type === BlockType.Image)
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
      type: BlockType.Text,
      text: "",
      key: generateBlockKey(nextBlockGroup.blocks),
      moving: false,
      position: null,
      previewIndex: null,
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
        moving: false,
        position: null,
        previewIndex: null,
      };
      newBlockGroup.blocks.push({
        type: BlockType.Text,
        text: "",
        key: generateBlockKey(newBlockGroup.blocks),
        moving: false,
        position: null,
        previewIndex: null,
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
      moving: false,
      position: null,
      previewIndex: null,
    };
    newBlockGroup.blocks.push({
      type: BlockType.Text,
      text: "",
      key: generateBlockKey(newBlockGroup.blocks),
      moving: false,
      position: null,
      previewIndex: null,
    });

    const nextBlockGroups = blockGroups.slice();
    nextBlockGroups.splice(createAtIndex, 0, newBlockGroup);

    setBlockGroups(nextBlockGroups);
  }

  function handleBlockMove(
    blockGroupIndex: number,
    blockIndex: number,
    position: Position
  ) {
    const nextBlockGroups = blockGroups.slice();
    const blockGroup = nextBlockGroups[blockGroupIndex];
    const nextBlock = { ...blockGroup.blocks[blockIndex] };
    blockGroup.blocks[blockIndex] = nextBlock;
    if (position) {
      nextBlock.moving = true;
      nextBlock.position = position;
    } else {
      nextBlock.moving = false;
      nextBlock.position = null;
      if (
        previewIndex !== null &&
        nextBlockGroups[previewIndex.blockGroupIndex].blocks.length + 1 <= 5
      ) {
        // add block to group
      }
    }
    setBlockGroups(nextBlockGroups);
  }

  function handleBlockGroupMove(blockGroupIndex: number, position: Position) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    if (position) {
      nextBlockGroup.moving = true;
      nextBlockGroup.position = position;
    } else {
      nextBlockGroup.moving = false;
      nextBlockGroup.position = null;
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

  const currMovingBlock =
    blockGroups
      .find((blockGroup) => blockGroup.blocks.some((block) => block.moving))
      ?.blocks.find((block) => block.moving) ?? null;

  console.log("curr moving:");
  console.log(currMovingBlock);

  const currMovingBlockGroup =
    blockGroups.find((blockGroup) => blockGroup.moving) ?? null;

  return (
    <div
      className={`noteContent ${
        currMovingBlock || currMovingBlockGroup ? "moving" : ""
      } ${isDeleting ? "deleting" : ""}`}
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
            currMovingBlock
              ? currMovingBlock
              : !blockGroup.moving
              ? currMovingBlockGroup
              : null
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
          onBlockMove={handleBlockMove}
          onBlockGroupMove={handleBlockGroupMove}
          onPreviewIndexUpdate={handlePreviewIndexUpdate}
        />
      ))}
    </div>
  );
}
