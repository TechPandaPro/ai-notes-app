// TODO: AI! keybind can maybe be shift+enter to send to GPT

// TODO: add keybind to delete block (cmd+backspace?)

import {
  ChangeEvent,
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

interface BlockProps {
  blockIndex: number;
  type: BlockType;
  text: string;
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
  onQueryAi: () => void;
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
}: BlockProps) {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
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

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      // TODO: decide between query or inquire
      // onQueryAi(blockIndex);
      onQueryAi();
    } else if (e.key === "Enter") {
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

  // useEffect(() => {
  //   document.addEventListener("mouseup", handleMouseUp);
  //   return () => document.removeEventListener("mouseup", handleMouseUp);
  // }, []);

  return (
    <div
      className={`block ${isMoving ? "moving" : ""}`}
      // FIXME: figure out why err is sometimes thrown for .toLowerCase() on undefined - type should never be undefined!
      data-type={type.toLowerCase()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
          readOnly={isDeleting}
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
