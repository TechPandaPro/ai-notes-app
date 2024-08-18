import { useState } from "react";
import Block from "./Block";

export default function NoteContent() {
  // function handleInput() {}

  const [blocks, setBlocks] = useState<string[]>(["hello, world"]);
  const [focusIndex, setFocusIndex] = useState<number>(null);

  // TODO: block should be created at next index, not at end
  function handleCreateBlock() {
    setFocusIndex(blocks.length);
    setBlocks([...blocks, ""]);
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
          text={block}
          autoFocus={i === focusIndex}
          onCreateBlock={handleCreateBlock}
        />
      ))}
    </div>
  );
}
