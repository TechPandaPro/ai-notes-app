// TODO: AI! keybind can maybe be shift+enter to send to GPT

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import BlockAddInline from "./BlockAddInline";
import DeleteBlock from "./DeleteBlock";
import BlockTypePicker from "./BlockTypePicker";
import BlockImage from "./BlockImage";
import { BlockType } from "./BlockTypeOption";

interface BlockProps {
  blockIndex: number;
  type: BlockType;
  text: string;
  imgUrl: string | null;
  attemptLoad: boolean;
  siblingCount: number;
  // lastInGroup: boolean;
  isFocused: boolean;
  isDeleting: boolean;
  onTypeUpdate: (blockIndex: number, type: BlockType) => void;
  onTextUpdate: (blockIndex: number, newText: string) => void;
  onImageUpdate: (blockIndex: number, imgUrl: string | null) => void;
  onAttemptLoadUpdate: (blockIndex: number, attemptLoad: boolean) => void;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  onAddBlock: (createAtIndex: number) => void;
  onDeleteBlock: (deleteIndex: number) => void;
  onAddBlockGroup: () => void;
}

export default function Block({
  blockIndex,
  type,
  text,
  imgUrl,
  attemptLoad,
  siblingCount,
  // lastInGroup,
  isFocused,
  isDeleting,
  onTypeUpdate,
  onTextUpdate,
  onImageUpdate,
  onAttemptLoadUpdate,
  onSetFocus,
  onAddBlock,
  onDeleteBlock,
  onAddBlockGroup,
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  // const [selectedOption, setSelectedOption] = useState<string>("text");

  // const [prevTypeId, setPrevTypeId] = useState(typeId);
  // const [prevSiblingCount, setPrevSiblingCount] = useState(siblingCount);

  // const [prevIsFocused, setPrevIsFocused] = useState(isFocused);

  const blockEditableRef = useRef<HTMLTextAreaElement>(null);

  function handleImageUpdate(imgUrl: string | null) {
    onImageUpdate(blockIndex, imgUrl);
  }

  function handleAttemptLoadUpdate(attemptLoad: boolean) {
    onAttemptLoadUpdate(blockIndex, attemptLoad);
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

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddBlockGroup();
    }
  }

  function setSize() {
    const block = blockEditableRef.current;
    if (!block) return;

    const measureElem = document.createElement("div");
    measureElem.classList.add("measureElem");
    measureElem.dataset.type = type.toLowerCase();
    measureElem.innerText =
      block.value.trim().length >= 1 ? block.value : "\\00a0";
    measureElem.style.width = `${block.offsetWidth}px`;
    document.body.append(measureElem);

    setBlockHeight(measureElem.offsetHeight);

    measureElem.remove();
  }

  function handleAddBlock(createAtIndex: number) {
    onAddBlock(createAtIndex);
  }

  // function handleSelectOption(id: string) {
  //   setSelectedOption(id);
  // }

  function handleSelectType(type: BlockType) {
    onTypeUpdate(blockIndex, type);
  }

  function handleDeleteBlock(deleteIndex: number) {
    onDeleteBlock(deleteIndex);
  }

  useEffect(() => {
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [type]);

  // if (typeId !== prevTypeId || siblingCount !== prevSiblingCount) {
  //   setPrevTypeId(typeId);
  //   setPrevSiblingCount(siblingCount);
  //   setSize();
  // }

  useEffect(() => {
    // console.log("resize");
    setSize();
  }, [type, siblingCount]);

  // if (isFocused !== prevIsFocused) {
  //   setPrevIsFocused(isFocused);
  //   if (!blockEditableRef.current) return;
  //   if (isFocused) blockEditableRef.current.focus();
  //   if (!isFocused) blockEditableRef.current.blur();
  // }

  useEffect(() => {
    if (!blockEditableRef.current) return;
    if (isFocused) blockEditableRef.current.focus();
    if (!isFocused) blockEditableRef.current.blur();
  }, [isFocused]);

  return (
    // TODO: allow individual blocks to be dragged when in delete mode
    <div className="block" data-type={type.toLowerCase()}>
      {!isDeleting && siblingCount + 1 < 5 && blockIndex === 0 ? (
        <BlockAddInline
          createAtIndex={blockIndex}
          position={-1}
          onAddBlock={handleAddBlock}
        />
      ) : (
        ""
      )}
      {type === BlockType.Image ? (
        <BlockImage
          imgUrl={imgUrl}
          attemptLoad={attemptLoad}
          isDeleting={isDeleting}
          onImageUpdate={handleImageUpdate}
          onAttemptLoadUpdate={handleAttemptLoadUpdate}
        />
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
      {text.length === 0 && !imgUrl ? (
        !isDeleting ? (
          <BlockTypePicker
            selectedOption={type}
            onTypeUpdate={handleSelectType}
          />
        ) : (
          ""
        )
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
