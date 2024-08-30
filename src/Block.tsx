// TODO: AI! keybind can maybe be shift+enter to send to GPT

// TODO: add keybind to delete block (cmd+backspace?)

import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  // MouseEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import BlockAddInline from "./BlockAddInline";
import DeleteBlock from "./DeleteBlock";
import BlockTypePicker from "./BlockTypePicker";
import BlockImage from "./BlockImage";
import { BlockType } from "./BlockTypeOption";
import { Position } from "./BlockGroupMarker";
import BlockAI from "./BlockAI";

interface BlockProps {
  blockIndex: number;
  type: BlockType;
  text: string;
  generating?: boolean;
  addingText?: { char: string; key: string }[];
  imgUrl: string | null;
  attemptLoad: boolean;
  siblingCount: number;
  // lastInGroup: boolean;
  isFocused: boolean;
  isMoving: boolean;
  isDeleting: boolean;
  // moving: boolean;
  onTypeUpdate: (blockIndex: number, type: BlockType) => void;
  onTextUpdate: (blockIndex: number, newText: string) => void;
  onImageUpdate: (blockIndex: number, imgUrl: string | null) => void;
  onAttemptLoadUpdate: (blockIndex: number, attemptLoad: boolean) => void;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  // onSetMoving: (blockIndex: number, isMoving: boolean) => void;
  onMove: (blockIndex: number, position: Position) => void;
  onAddBlock: (createAtIndex: number) => void;
  onDeleteBlock: (deleteIndex: number) => void;
  onAddBlockGroup: () => void;
  // onQueryAi: (blockIndex: number) => void;
  onQueryAi: (regenOptions?: { lastResponse: string; prompt: string }) => void;
  onMergeChar: (key: string) => void;
}

export default function Block({
  blockIndex,
  type,
  text,
  generating,
  addingText,
  imgUrl,
  attemptLoad,
  siblingCount,
  // lastInGroup,
  isFocused,
  isMoving,
  isDeleting,
  // moving,
  onTypeUpdate,
  onTextUpdate,
  onImageUpdate,
  onAttemptLoadUpdate,
  onSetFocus,
  // onSetMoving,
  onMove,
  onAddBlock,
  onDeleteBlock,
  onAddBlockGroup,
  onQueryAi,
  onMergeChar,
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [regenPrompt, setRegenPrompt] = useState<string | null>(null);
  // const [selectedOption, setSelectedOption] = useState<string>("text");

  // const [prevTypeId, setPrevTypeId] = useState(typeId);
  // const [prevSiblingCount, setPrevSiblingCount] = useState(siblingCount);

  // const [prevIsFocused, setPrevIsFocused] = useState(isFocused);

  const blockEditableRef = useRef<HTMLTextAreaElement>(null);

  function handleMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    if (
      !isDeleting ||
      (e.target as HTMLElement).classList.contains("deleteBlock")
    )
      return;
    e.preventDefault();
    // onSetMoving(blockIndex, true);
    onMove(blockIndex, {
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
    });
  }

  function handleMouseUp(e: ReactMouseEvent<HTMLDivElement>) {
    // console.log("mouse up");
    if (!isDeleting) return;
    e.preventDefault();
    // onSetMoving(blockIndex, false);
    onMove(blockIndex, null);
  }

  function handlePaste(e: ClipboardEvent) {
    console.log(e.clipboardData);
    console.log(e.clipboardData.files[0]);

    const file = e.clipboardData.files[0];

    if (file) {
      e.preventDefault();

      const fileReader = new FileReader();
      fileReader.addEventListener(
        "load",
        () => {
          if (typeof fileReader.result !== "string")
            throw new Error(
              `Unexpected file reader result type: ${typeof fileReader.result}`
            );
          onImageUpdate(blockIndex, fileReader.result);
        },
        { once: true }
      );
      fileReader.readAsDataURL(file);
    } else if (type === BlockType.Image) {
      const text = e.clipboardData.getData("text");
      if (text) {
        e.preventDefault();
        onTextUpdate(blockIndex, text);
      }
    }
  }

  function handleMouseMove(e: MouseEvent) {
    onMove(blockIndex, {
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
    });
  }

  useEffect(() => {
    if (isMoving) window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMoving]);

  // function handleMouseDown(
  //   e: ReactMouseEvent<HTMLDivElement | HTMLTextAreaElement>
  // ) {
  //   // if (!isDeleting || moving) return;
  //   if (!isDeleting) return;
  //   // if (moving) return;

  //   e.preventDefault();

  //   const blockMarkerRect = e.currentTarget.getBoundingClientRect();

  //   onMove(blockIndex, {
  //     x: e.clientX,
  //     y: e.clientY,
  //     width: blockMarkerRect.width,
  //     height: blockMarkerRect.height,
  //     offsetX: blockMarkerRect.width / 2 - e.nativeEvent.offsetX,
  //     offsetY: blockMarkerRect.height / 2 - e.nativeEvent.offsetY,
  //   });
  // }

  // function handleMouseUp(
  //   e: ReactMouseEvent<HTMLDivElement | HTMLTextAreaElement>
  // ) {
  //   if (!isDeleting || !moving) return;
  //   // if (!moving) return;

  //   e.preventDefault();

  //   onMove(blockIndex, null);
  // }

  // function updateMouseState(e: MouseEvent) {
  //   if (!moving) return;

  //   // const blockMarker = (e.target as HTMLDivElement).parentElement;
  //   // const parentRect =
  //   //   blockMarkerRef.current.parentElement.getBoundingClientRect();

  //   e.preventDefault();

  //   // setPosition({
  //   //   // x: e.clientX - parentRect.left,
  //   //   // y: e.clientY - parentRect.top,
  //   //   x: e.clientX,
  //   //   y: e.clientY,
  //   //   width: position.width,
  //   //   height: position.height,
  //   //   offsetX: position.offsetX,
  //   //   offsetY: position.offsetY,
  //   // });

  //   onMove(blockIndex, {
  //     x: e.clientX,
  //     y: e.clientY,
  //     width: position.width,
  //     height: position.height,
  //     offsetX: position.offsetX,
  //     offsetY: position.offsetY,
  //   });
  // }

  // useEffect(() => {
  //   if (moving) {
  //     window.addEventListener("mousemove", updateMouseState);
  //     return () => window.removeEventListener("mousemove", updateMouseState);
  //   }
  // }, [position]);

  function handleImageUpdate(imgUrl: string | null) {
    onImageUpdate(blockIndex, imgUrl);
  }

  function handleAttemptLoadUpdate(attemptLoad: boolean) {
    onAttemptLoadUpdate(blockIndex, attemptLoad);
  }

  function handlePromptUpdate(newPrompt: string) {
    setRegenPrompt(newPrompt);
  }

  function handleRegenerate() {
    onQueryAi({ lastResponse: text, prompt: regenPrompt ?? "" });
    setRegenPrompt(null);
    console.log("regenerate");
  }

  function handleInsert() {
    // TODO: consider animating this
    onTypeUpdate(blockIndex, BlockType.Text);
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
    if (!isDeleting) onSetFocus(blockIndex, true);
  }

  function handleBlur() {
    if (!isDeleting) onSetFocus(blockIndex, false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    // console.log(e);
    // TODO: improve conditions (combine all shiftKey combos)
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      // TODO: decide between query or inquire
      // onQueryAi(blockIndex);
      onQueryAi();
    } else if (e.key === "Enter") {
      e.preventDefault();
      onAddBlockGroup();
    } else if (e.key === "Backspace" && e.shiftKey) {
      e.preventDefault();
      onDeleteBlock(blockIndex);
      // } else if (!isNaN(Number(e.key)) && e.shiftKey) {
    } else if (
      type !== BlockType.AI &&
      text.length === 0 &&
      !imgUrl &&
      !isDeleting &&
      e.code.startsWith("Digit") &&
      e.shiftKey
    ) {
      // const num = Number(e.key);
      const num = Number(e.code.substring("Digit".length));
      const setType = [BlockType.Text, BlockType.Header, BlockType.Image][
        num - 1
      ];
      if (setType) {
        e.preventDefault();
        onTypeUpdate(blockIndex, setType);
      }
    }
  }

  function setSize() {
    const blockEditable = blockEditableRef.current;
    if (!blockEditable) return;

    const measureElem = document.createElement("div");
    measureElem.classList.add("measureElem");
    measureElem.dataset.type = type.toLowerCase();
    measureElem.innerText =
      blockEditable.value.trim().length >= 1 ? blockEditable.value : "\\00a0";
    measureElem.style.width = `${blockEditable.offsetWidth}px`;
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

  // function handleDeleteBlock(deleteIndex: number) {
  //   onDeleteBlock(deleteIndex);
  // }

  function handleDeleteBlock() {
    onDeleteBlock(blockIndex);
  }

  useEffect(() => {
    if (type === BlockType.Text || type === BlockType.Header)
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
    if (type === BlockType.Text || type === BlockType.Header) setSize();
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

  // useEffect(() => {
  //   document.addEventListener("mouseup", handleMouseUp);
  //   return () => document.removeEventListener("mouseup", handleMouseUp);
  // }, []);

  // const visuallyGenerating =
  //   !generating && (!addingText || addingText.length === 0);

  return (
    <div
      className={`block ${isMoving ? "moving" : ""}`}
      // FIXME: figure out why err is sometimes thrown for .toLowerCase() on undefined - type should never be undefined!
      data-type={type.toLowerCase()}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onPaste={handlePaste}
      // onMouseDown={handleMouseDown}
      // onMouseUp={handleMouseUp}
    >
      {!isDeleting && siblingCount + 1 < 5 && blockIndex === 0 ? (
        <BlockAddInline
          createAtIndex={blockIndex}
          position={-1}
          onAddBlock={handleAddBlock}
        />
      ) : (
        ""
      )}
      {/* TODO: consider moving these to separate components */}
      {type === BlockType.Image ? (
        <BlockImage
          imgUrl={imgUrl}
          attemptLoad={attemptLoad}
          isDeleting={isDeleting}
          onImageUpdate={handleImageUpdate}
          onAttemptLoadUpdate={handleAttemptLoadUpdate}
        />
      ) : type === BlockType.AI ? (
        <BlockAI
          text={text}
          generating={generating}
          addingText={addingText}
          regenPrompt={regenPrompt ?? ""}
          onPromptUpdate={handlePromptUpdate}
          onRegenerate={handleRegenerate}
          onInsert={handleInsert}
          onMergeChar={onMergeChar}
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
          readOnly={isDeleting}
          onInput={handleInput}
          // onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // defaultValue={previewIndex}
        />
      )}
      {type !== BlockType.AI && text.length === 0 && !imgUrl && !isDeleting ? (
        <BlockTypePicker
          selectedOption={type}
          onTypeUpdate={handleSelectType}
        />
      ) : (
        ""
      )}
      {isDeleting ? (
        <DeleteBlock
          // deleteIndex={blockIndex}
          onDeleteBlock={handleDeleteBlock}
        />
      ) : (
        ""
      )}
      {!isDeleting &&
      siblingCount + 1 < 5 &&
      (blockIndex !== siblingCount || type !== BlockType.AI) ? (
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
