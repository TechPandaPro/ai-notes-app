import { useState } from "react";
import { Position } from "./BlockMarker";
import BlockGroup from "./BlockGroup";

export interface BlockInfo {
  text: string[];
  key: string;
  position: Position;
  moving: boolean;
}

export default function NoteContent() {
  // function handleInput() {}

  const [blocks, setBlocks] = useState<BlockInfo[]>([
    {
      text: ["hello, world"],
      key: `${Date.now()}_0`,
      position: null,
      moving: false,
    },
  ]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  // for (let i = 0; i < blocks.length; i++) {
  //   const block = blocks[i];
  //   if (!block.key) {
  //     const newBlocks = blocks.slice();
  //     newBlocks[i].key = generateBlockKey();
  //     setBlocks(newBlocks);
  //   }
  // }

  function handleTextUpdate(blockIndex: number, newText: string) {
    const nextBlocks = blocks.slice();
    const nextBlock = { ...nextBlocks[blockIndex] };
    nextBlocks[blockIndex] = nextBlock;
    nextBlock.text = [newText];
    setBlocks(nextBlocks);
  }

  function handleSetFocus(blockIndex: number, isFocused: boolean) {
    if (isFocused) setFocusIndex(blockIndex);
    else if (blockIndex === focusIndex) setFocusIndex(null);
    console.log(isFocused);
  }

  function handleCreateBlock(createAtIndex: number) {
    setFocusIndex(createAtIndex);

    const nextBlocks = blocks.slice();
    nextBlocks.splice(createAtIndex, 0, {
      text: [""],
      key: generateBlockKey(),
      position: null,
      moving: false,
    });
    console.log(nextBlocks);
    // setBlocks([...blocks, ""]);
    setBlocks(nextBlocks);
  }

  function handleMove(blockIndex: number, position: Position) {
    const nextBlocks = blocks.slice();
    const nextBlock = { ...nextBlocks[blockIndex] };
    nextBlocks[blockIndex] = nextBlock;
    if (position) {
      // nextBlocks[blockIndex].position = position;
      // nextBlocks[blockIndex].moving = true;
      nextBlock.position = position;
      nextBlock.moving = true;
    } else nextBlock.moving = false;
    setBlocks(nextBlocks);
  }

  function generateBlockKey() {
    const stamp = Date.now();
    const foundCount = blocks.filter(
      (block) => block.key && block.key.startsWith(`${stamp}_`)
    ).length;
    return `${stamp}_${foundCount}`;
  }

  const currMovingBlock = blocks.find((block) => block.moving) ?? null;

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
      {blocks.map((block, i) => (
        // TODO: add key prop
        <BlockGroup
          key={block.key}
          blockIndex={i}
          text={block.text}
          autoFocus={i === focusIndex}
          position={block.position}
          moving={block.moving}
          currMovingBlock={!block.moving ? currMovingBlock : null}
          onTextUpdate={handleTextUpdate}
          onSetFocus={handleSetFocus}
          onCreateBlock={handleCreateBlock}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}
