import { useState } from "react";
import { Position } from "./BlockMarker";
import BlockGroup from "./BlockGroup";

export interface BlockInfo {
  text: string;
  key: string;
}

export interface BlockGroupInfo {
  texts: BlockInfo[];
  key: string;
  position: Position;
  moving: boolean;
}

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
    },
  ]);
  const [focusIndex, setFocusIndex] = useState<FullBlockIndex | null>(null);

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
      blockGroupIndex === focusIndex.blockGroupIndex &&
      blockIndex === focusIndex.blockIndex
    )
      setFocusIndex(null);
  }

  function handleCreateBlock(createAtIndex: number) {
    setFocusIndex({ blockGroupIndex: createAtIndex, blockIndex: 0 });

    const newBlockGroup: BlockGroupInfo = {
      texts: [],
      key: generateBlockKey(blockGroups),
      position: null,
      moving: false,
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
    } else nextBlock.moving = false;
    setBlockGroups(nextBlocks);
  }

  function generateBlockKey(siblingBlocks: (BlockGroupInfo | BlockInfo)[]) {
    const stamp = Date.now();
    const foundCount = siblingBlocks.filter(
      (block) => block.key && block.key.startsWith(`${stamp}_`)
    ).length;
    return `${stamp}_${foundCount}`;
  }

  const currMovingBlockGroup =
    blockGroups.find((blockGroup) => blockGroup.moving) ?? null;

  return (
    <div className="noteContent">
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
          position={blockGroup.position}
          moving={blockGroup.moving}
          currMovingBlockGroup={
            !blockGroup.moving ? currMovingBlockGroup : null
          }
          onTextUpdate={handleTextUpdate}
          onSetFocus={handleSetFocus}
          onCreateBlock={handleCreateBlock}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}
