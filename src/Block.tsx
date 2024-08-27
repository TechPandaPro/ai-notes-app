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

  function handleDeleteBlock(deleteIndex: number) {
    onDeleteBlock(deleteIndex);
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
      ) : type === BlockType.AI ? (
        <div className="aiBlockInnerContainer">
          <div className="aiBlockInnerIcon">
            <svg
              width="426"
              height="426"
              viewBox="0 0 426 426"
              // fill="none"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M106.771 208.615C115.797 206.393 122.844 199.345 125.067 190.319L146.677 102.57C152.923 77.2075 188.981 77.2074 195.227 102.57L216.836 190.319C219.059 199.345 226.107 206.393 235.133 208.615L322.882 230.225C348.244 236.471 348.244 272.529 322.882 278.775L235.133 300.384C226.107 302.607 219.059 309.655 216.836 318.681L195.227 406.43C188.981 431.792 152.923 431.792 146.677 406.43L125.067 318.681C122.844 309.655 115.797 302.607 106.771 300.384L19.0219 278.775C-6.34062 272.529 -6.34065 236.471 19.0219 230.225L106.771 208.615Z"
                // fill="black"
              />
              <path
                d="M295.474 69.1356C300.463 67.9068 304.359 64.0111 305.588 59.0215L317.533 10.5151C320.986 -3.50501 340.918 -3.50503 344.371 10.5151L356.317 59.0215C357.545 64.0111 361.441 67.9068 366.431 69.1356L414.937 81.0812C428.957 84.5339 428.957 104.466 414.937 107.919L366.431 119.864C361.441 121.093 357.545 124.989 356.317 129.979L344.371 178.485C340.918 192.505 320.986 192.505 317.533 178.485L305.588 129.979C304.359 124.989 300.463 121.093 295.474 119.864L246.967 107.919C232.947 104.466 232.947 84.5339 246.967 81.0812L295.474 69.1356Z"
                // fill="black"
              />
            </svg>
            <div>Thinking...</div>
          </div>
          <div className="aiBlockInnerText">{text}</div>
        </div>
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
