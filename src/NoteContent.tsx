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
  // function handleInput() {}

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
      ],
      key: `${Date.now()}_0`,
      position: null,
      moving: false,
    },
  ]);
  const [focusIndex, setFocusIndex] = useState<FullBlockIndex | null>(null);

  // for (let i = 0; i < blocks.length; i++) {
  //   const block = blocks[i];
  //   if (!block.key) {
  //     const newBlocks = blocks.slice();
  //     newBlocks[i].key = generateBlockKey();
  //     setBlocks(newBlocks);
  //   }
  // }

  function handleTextUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    newTexts: string
  ) {
    const nextBlocks = blockGroups.slice();
    const nextBlock = { ...nextBlocks[blockGroupIndex] };
    // FIXME: support multiple texts
    nextBlock.texts[0].text = newTexts;
    nextBlocks[blockGroupIndex] = nextBlock;
    // nextBlock.texts = [newTexts];
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
    // console.log(isFocused);
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

    // console.log(nextBlocks);
    // setBlocks([...blocks, ""]);
    setBlockGroups(nextBlocks);
  }

  function handleMove(blockGroupIndex: number, position: Position) {
    const nextBlocks = blockGroups.slice();
    const nextBlock = { ...nextBlocks[blockGroupIndex] };
    nextBlocks[blockGroupIndex] = nextBlock;
    if (position) {
      // nextBlocks[blockIndex].position = position;
      // nextBlocks[blockIndex].moving = true;
      nextBlock.position = position;
      nextBlock.moving = true;
    } else nextBlock.moving = false;
    setBlockGroups(nextBlocks);
  }

  // function generateBlockKey(siblingBlocks: BlockGroupInfo[] | BlockInfo[]) {
  // function generateBlockKey(siblingBlocks: { key: string }[]) {
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
    // <div
    //   className="noteContent"
    //   contentEditable={true}
    //   // onInput={handleInput}
    //   suppressContentEditableWarning={true}
    // ></div>
    <div className="noteContent">
      {/* <textarea className="block">hello, world</textarea> */}
      {/* <Block text="hello, world" onCreateBlock={handleCreateBlock} /> */}
      {blockGroups.map((blockGroup, blockGroupIndex) => (
        // TODO: add key prop
        <BlockGroup
          key={blockGroup.key}
          blockGroupIndex={blockGroupIndex}
          texts={blockGroup.texts}
          // FIXME: autoFocus should not be universal for group
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
