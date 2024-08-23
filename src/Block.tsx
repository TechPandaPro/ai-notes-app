// TODO: AI! keybind can maybe be shift+enter to send to GPT

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import BlockAddInline from "./BlockAddInline";
import DeleteBlock from "./DeleteBlock";
import BlockTypePicker from "./BlockTypePicker";
import BlockImage from "./BlockImage";

interface BlockProps {
  blockIndex: number;
  typeId: string;
  text: string;
  imgUrl: string | null;
  siblingCount: number;
  // lastInGroup: boolean;
  isFocused: boolean;
  isDeleting: boolean;
  onTypeUpdate: (blockIndex: number, typeId: string) => void;
  onTextUpdate: (blockIndex: number, newText: string) => void;
  onImageUpdate: (blockIndex: number, imgUrl: string | null) => void;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  onAddBlock: (createAtIndex: number) => void;
  onDeleteBlock: (deleteIndex: number) => void;
  onAddBlockGroup: () => void;
}

export default function Block({
  blockIndex,
  typeId,
  text,
  imgUrl,
  siblingCount,
  // lastInGroup,
  isFocused,
  isDeleting,
  onTypeUpdate,
  onTextUpdate,
  onImageUpdate,
  onSetFocus,
  onAddBlock,
  onDeleteBlock,
  onAddBlockGroup,
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  // const [selectedOption, setSelectedOption] = useState<string>("text");

  const blockEditableRef = useRef<HTMLTextAreaElement>(null);

  function handleImageUpdate(imgUrl: string | null) {
    onImageUpdate(blockIndex, imgUrl);
  }

  // function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    // function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    // const target = e.target as HTMLTextAreaElement;
    // console.log("input!");

    setSize();
    onTextUpdate(blockIndex, e.target.value);
  }

  function handleFocus() {
    onSetFocus(blockIndex, true);
  }

  function handleBlur() {
    onSetFocus(blockIndex, false);
  }

  // TODO: allow user to press esc to unfocus, and maybe press it again to enter "edit mode"
  // doesn't necessarily need to be within block component though
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddBlockGroup();
    }
  }

  // TODO: make sure that size gets updated when another block's size is updated within the same group
  // (i.e. the backgrounds shouldn't be inconsistent)
  function setSize() {
    const block = blockEditableRef.current;
    if (!block) return;
    // TODO: consider using invisible div to measure this. that way the dom that react manages won't be manipulated
    // const oldHeight = block.style.height;
    // block.style.height = "0";
    // block.offsetHeight;
    // setBlockHeight(block.scrollHeight);
    // if (oldHeight) block.style.setProperty("height", oldHeight);
    // else block.style.removeProperty("height");

    const measureElem = document.createElement("div");
    // TODO: make sure this has same padding/etc as blockEditable, and it needs to be absolute and have visibility: hidden
    measureElem.classList.add("measureElem");
    measureElem.dataset.type = typeId;
    measureElem.innerText =
      block.value.trim().length >= 1 ? block.value : "\\00a0";
    measureElem.style.width = `${block.offsetWidth}px`;
    document.body.append(measureElem);
    // do stuff with the height accordingly
    // console.log(measureElem.offsetHeight);
    setBlockHeight(measureElem.offsetHeight);
    // console.log(measureElem.offsetHeight);
    measureElem.remove();
  }

  function handleAddBlock(createAtIndex: number) {
    onAddBlock(createAtIndex);
  }

  // function handleSelectOption(id: string) {
  //   setSelectedOption(id);
  // }

  function handleSelectType(typeId: string) {
    onTypeUpdate(blockIndex, typeId);
  }

  function handleDeleteBlock(deleteIndex: number) {
    onDeleteBlock(deleteIndex);
  }

  useEffect(() => {
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [typeId]);

  useEffect(() => {
    // console.log("resize");
    setSize();
  }, [typeId, siblingCount]);

  useEffect(() => {
    if (!blockEditableRef.current) return;
    if (!isFocused) blockEditableRef.current.blur();
  }, [isFocused]);

  return (
    // TODO: allow individual blocks to be dragged when in delete mode
    <div className="block" data-type={typeId}>
      {!isDeleting && siblingCount + 1 < 5 && blockIndex === 0 ? (
        <BlockAddInline
          createAtIndex={blockIndex}
          position={-1}
          onAddBlock={handleAddBlock}
        />
      ) : (
        ""
      )}
      {typeId === "image" ? (
        <BlockImage imgUrl={imgUrl} onImageUpdate={handleImageUpdate} />
      ) : (
        <textarea
          ref={blockEditableRef}
          style={{
            height: blockHeight ?? undefined,
            // backgroundColor: autoFocus ? "blue" : "transparent",
          }} /* numbers are automatically converted to px */
          rows={
            1
          } /* this will be overriden by the style prop when the textarea has a value */
          className="blockEditable"
          defaultValue={text}
          autoFocus={isFocused}
          disabled={isDeleting}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // defaultValue={previewIndex}
        />
      )}
      {text.length === 0 ? (
        <BlockTypePicker
          selectedOption={typeId}
          onTypeUpdate={handleSelectType}
        />
      ) : (
        ""
      )}
      {isDeleting ? (
        <DeleteBlock
          deleteIndex={blockIndex}
          onDeleteBlock={handleDeleteBlock}
        />
      ) : (
        ""
      )}
      {!isDeleting && siblingCount + 1 < 5 ? (
        <BlockAddInline
          createAtIndex={blockIndex + 1}
          position={blockIndex === siblingCount ? 0 : 1}
          // position={lastInGroup ? 0 : 1}
          onAddBlock={handleAddBlock}
        />
      ) : (
        ""
      )}
    </div>
  );
}
