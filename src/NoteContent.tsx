import { useState } from "react";
import Block from "./Block";
import { Position } from "./BlockMarker";

interface BlockInfo {
  text: string;
  key: string;
  position: Position;
  moving: boolean;
}

export default function NoteContent() {
  // function handleInput() {}

  const [blocks, setBlocks] = useState<BlockInfo[]>([
    {
      text: "hello, world",
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

  function handleSetFocus(blockIndex: number, isFocused: boolean) {
    if (isFocused) setFocusIndex(blockIndex);
    else if (blockIndex === focusIndex) setFocusIndex(null);
    console.log(isFocused);
  }

  function handleCreateBlock(createAtIndex: number) {
    setFocusIndex(createAtIndex);

    const nextBlocks = blocks.slice();
    nextBlocks.splice(createAtIndex, 0, {
      text: "",
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
    if (position) {
      nextBlocks[blockIndex].position = position;
      nextBlocks[blockIndex].moving = true;
    } else nextBlocks[blockIndex].moving = false;
    setBlocks(nextBlocks);
  }

  function generateBlockKey() {
    const stamp = Date.now();
    const foundCount = blocks.filter(
      (block) => block.key && block.key.startsWith(`${stamp}_`)
    ).length;
    return `${stamp}_${foundCount}`;
  }

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
        <Block
          key={block.key}
          blockIndex={i}
          text={block.text}
          autoFocus={i === focusIndex}
          position={block.position}
          moving={block.moving}
          onSetFocus={handleSetFocus}
          onCreateBlock={handleCreateBlock}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}
