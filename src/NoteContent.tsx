import { useEffect, useState } from "react";
import { Position } from "./BlockMarker";
import BlockGroup from "./BlockGroup";

export interface BlockInfo {
  text: string;
  key: string;
}

interface BlockGroupBase {
  // export interface BlockGroupInfo {
  texts: BlockInfo[];
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

export default function NoteContent() {
  const [blockGroups, setBlockGroups] = useState<BlockGroupInfo[]>([
    {
      texts: [
        {
          text: "hello, world",
          key: `${Date.now()}_0`,
        },
        {
          text: "lorem ipsum",
          key: `${Date.now()}_1`,
        },
        {
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
      texts: [
        {
          text: "hello, world",
          key: `${Date.now()}_0`,
        },
        {
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

  function handleTextUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    newTexts: string
  ) {
    const nextBlocks = blockGroups.slice();
    const nextBlock = { ...nextBlocks[blockGroupIndex] };
    nextBlock.texts[blockIndex].text = newTexts;
    nextBlocks[blockGroupIndex] = nextBlock;
    setBlockGroups(nextBlocks);
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
    const nextBlocks = blockGroups.slice();
    const nextBlock = { ...nextBlocks[blockGroupIndex] };
    nextBlock.texts.splice(createAtIndex, 0, {
      text: "",
      key: generateBlockKey(nextBlock.texts),
    });
    setBlockGroups(nextBlocks);
    setFocusIndex({ blockGroupIndex, blockIndex: createAtIndex });
  }

  function handleAddBlockGroup(createAtIndex: number) {
    setFocusIndex({ blockGroupIndex: createAtIndex, blockIndex: 0 });

    const newBlockGroup: BlockGroupInfo = {
      texts: [],
      key: generateBlockKey(blockGroups),
      position: null,
      moving: false,
      previewIndex: null,
    };
    newBlockGroup.texts.push({
      text: "",
      key: generateBlockKey(newBlockGroup.texts),
    });

    const nextBlocks = blockGroups.slice();
    nextBlocks.splice(createAtIndex, 0, newBlockGroup);

    setBlockGroups(nextBlocks);
  }

  function handleMove(blockGroupIndex: number, position: Position) {
    const nextBlocks = blockGroups.slice();
    const nextBlock = { ...nextBlocks[blockGroupIndex] };
    nextBlocks[blockGroupIndex] = nextBlock;
    if (position) {
      nextBlock.position = position;
      nextBlock.moving = true;
    } else {
      nextBlock.position = null;
      nextBlock.moving = false;
      if (
        previewIndex !== null &&
        nextBlocks[previewIndex.blockGroupIndex].texts.length +
          nextBlock.texts.length <=
          5
      ) {
        // TODO: add a limit for merging
        const nextPreviewedBlock = {
          ...nextBlocks[previewIndex.blockGroupIndex],
        };
        nextPreviewedBlock.texts.splice(
          previewIndex.blockIndex,
          0,
          ...nextBlock.texts
        );
        nextBlocks.splice(blockGroupIndex, 1);
        // TODO: in general, the use of "block" vs "block groups" might be confusing.
        // maybe try to update this for consistency. "blocks" should be "block groups", and
        // "texts" should be "blocks". (UNLESS you strictly think of "blocks" as the components
        // themselves, in which case it's fine to call them texts. think about this later.)
        for (const text of nextBlock.texts)
          text.key = generateBlockKey(nextPreviewedBlock.texts);
        setPreviewIndex(null);
      }
    }
    setBlockGroups(nextBlocks);
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
    console.log("key pressed");
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
          texts={blockGroup.texts}
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
            //     blockGroup.texts.length + currMovingBlockGroup.texts.length <= 5
            //     ? currMovingBlockGroup
            //     : null
            //   : null
          }
          invalidMove={
            !!(
              !blockGroup.moving &&
              currMovingBlockGroup &&
              blockGroup.texts.length + currMovingBlockGroup.texts.length > 5
            )
            // currMovingBlockGroup &&
            // previewIndex &&
            // blockGroupIndex === previewIndex.blockGroupIndex &&
            // blockGroup.texts.length + currMovingBlockGroup.texts.length > 5
            //   ? true
            //   : false
          }
          previewIndex={
            previewIndex && blockGroupIndex === previewIndex.blockGroupIndex
              ? previewIndex.blockIndex
              : null
          }
          isDeleting={isDeleting}
          onTextUpdate={handleTextUpdate}
          onSetFocus={handleSetFocus}
          onAddBlock={handleAddBlock}
          onAddBlockGroup={handleAddBlockGroup}
          onMove={handleMove}
          onPreviewIndexUpdate={handlePreviewIndexUpdate}
        />
      ))}
    </div>
  );
}
