// TODO: figure out why marker is sometimes way too large (full window width/height, seemingly) when dragging
// TODO: allow grouping by BlockMarker color etc.

import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useState,
  // useRef,
  // useState,
} from "react";
import BlockColorPicker from "./BlockColorPicker";
import { Position } from "./types";

// interface PositionInterface {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   offsetX: number;
//   offsetY: number;
// }

// export type Position = PositionInterface | null;

interface BlockMarkerPropsBase {
  colors: string[];
  colorIndex: number;
  focusBlockIndex: number | null;
  colorPickerIsOpen: boolean;
  moving: boolean;
  position: Position;
  onMove: (position: Position) => void;
  onCancelMove: () => void;
  onSetFocus: (blockIndex: number, isFocused: boolean) => void;
  // onSelectColor: (blockGroupIndex: number, colorIndex: number) => void;
  onOpenColorPicker: (open: boolean) => void;
  onSelectColor: (colorIndex: number) => void;
  onColorChange: (colorIndex: number, hex: string) => void;
}

interface BlockMarkerPropsStatic extends BlockMarkerPropsBase {
  moving: false;
  position: null;
}

interface BlockMarkerPropsMoving extends BlockMarkerPropsBase {
  moving: true;
  position: Exclude<Position, null>;
}

type BlockMarkerProps = BlockMarkerPropsStatic | BlockMarkerPropsMoving;

export default function BlockGroupMarker({
  colors,
  colorIndex,
  focusBlockIndex,
  colorPickerIsOpen,
  position,
  moving,
  onMove,
  onCancelMove,
  onSetFocus,
  onOpenColorPicker,
  onSelectColor,
  onColorChange,
}: BlockMarkerProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  // const [colorPickerIsOpen, setColorPickerIsOpen] = useState<boolean>(false);

  // const colors = [
  //   "#d3d3d3",
  //   "#ffff00", // yellow
  //   "#ffa500", // orange
  //   "#ff0000", // red
  //   "#add8e6", // light blue
  //   "#0000ff", // blue
  //   "#800080", // purple
  //   "#00ff00", // green
  //   // "#006400", // dark green
  // ];

  // const [position, setPosition] = useState<PositionInterface | null>(null);
  // const [moving, setMoving] = useState<boolean>(false);

  // const blockMarkerRef = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: ReactMouseEvent) {
    if (moving) return;

    e.preventDefault();

    // const blockMarkerRect = (
    //   e.target as HTMLDivElement
    // ).getBoundingClientRect();

    // onMove(blockGroupIndex, {
    //   x: e.clientX,
    //   y: e.clientY,
    //   width: blockMarkerRect.width,
    //   height: blockMarkerRect.height,
    //   offsetX: blockMarkerRect.width / 2 - e.nativeEvent.offsetX,
    //   offsetY: blockMarkerRect.height / 2 - e.nativeEvent.offsetY,
    // });

    setMouseDown(true);
  }

  function handleMouseUp(e: MouseEvent) {
    if (!mouseDown && !moving) return;

    // window.removeEventListener("mousemove", updateMouseState);

    e.preventDefault();

    // setPosition(null);
    // setOffset(null);

    if (moving) onMove(null);
    else {
      // in color picker: default of ~8 colors, colors should have lower opacity before hover, fully opaque when hovering, right click color for custom hex input (probably an input[type="color"])
      console.log("open color picker");
      // setColorPickerIsOpen(!colorPickerIsOpen);
      onOpenColorPicker(!colorPickerIsOpen);
      if (focusBlockIndex === null) onSetFocus(0, true); // TODO: consider setting this focus within NoteContent
    }

    setMouseDown(false);

    // setMoving(false);
  }

  function updateMouseState(e: MouseEvent) {
    // console.log((e.target as HTMLElement).matches(".blockMarkerInner"));

    // if (
    //   (!mouseDown && !moving) ||
    //   !(e.target as HTMLElement).matches(".blockMarkerInner")
    // )
    //   return;

    if (!mouseDown && !moving) return;

    // const blockMarker = (e.target as HTMLDivElement).parentElement;
    // const parentRect =
    //   blockMarkerRef.current.parentElement.getBoundingClientRect();

    e.preventDefault();

    // setPosition({
    //   // x: e.clientX - parentRect.left,
    //   // y: e.clientY - parentRect.top,
    //   x: e.clientX,
    //   y: e.clientY,
    //   width: position.width,
    //   height: position.height,
    //   offsetX: position.offsetX,
    //   offsetY: position.offsetY,
    // });

    if (moving)
      onMove({
        x: e.clientX,
        y: e.clientY,
        width: position.width,
        height: position.height,
        offsetX: position.offsetX,
        offsetY: position.offsetY,
      });
    else if ((e.target as HTMLElement).matches(".blockMarkerInner")) {
      console.log("start move");

      console.log(e.target);

      const blockMarkerRect = (
        e.target as HTMLDivElement
      ).getBoundingClientRect();

      onMove({
        x: e.clientX,
        y: e.clientY,
        width: blockMarkerRect.width,
        height: blockMarkerRect.height,
        offsetX: blockMarkerRect.width / 2 - e.offsetX,
        offsetY: blockMarkerRect.height / 2 - e.offsetY,
      });

      onOpenColorPicker(false);
    }
  }

  function handleDocumentClick(e: MouseEvent) {
    console.log("try to close");
    if (e.target && !(e.target as HTMLElement).matches(".blockMarker *")) {
      console.log(e.target);
      onOpenColorPicker(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    console.log(e.key);
    // if (e.key === "Backspace" && e.shiftKey) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      console.log("reset move");
      onCancelMove();
    }
  }

  function handleSelectColor(colorIndex: number) {
    // onSelectColor(blockGroupIndex, colorIndex);
    onSelectColor(colorIndex);
  }

  function handleColorChange(colorIndex: number, hex: string) {
    onColorChange(colorIndex, hex);
  }

  useEffect(() => {
    if (mouseDown || moving) {
      window.addEventListener("mousemove", updateMouseState);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", updateMouseState);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [mouseDown, position]);

  useEffect(() => {
    // if (colorPickerIsOpen)
    if (colorPickerIsOpen)
      document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [colorPickerIsOpen]);

  // useEffect(() => {
  //   window.addEventListener("mousemove", updateMouseState);
  //   return () => window.removeEventListener("mousemove", updateMouseState);
  // }, []);

  return (
    <>
      {/* {moving ? <div className="blockMarkerOverlay"></div> : ""} */}
      <div
        // ref={blockMarkerRef}
        className={`blockMarker ${moving ? "moving" : ""}`}
        style={
          moving
            ? {
                width: position.width,
                height: position.height,
                left: position.x + position.offsetX,
                top: position.y + position.offsetY,
              }
            : {}
        }
      >
        <div
          className="blockMarkerInner"
          onMouseDown={handleMouseDown}
          // onMouseUp={handleMouseUp}
          style={{
            backgroundColor: colors[colorIndex],
            boxShadow: `0 0 4px 1px ${colors[colorIndex]}`,
          }}
        ></div>
        {colorPickerIsOpen ? (
          <BlockColorPicker
            colors={colors}
            colorIndex={colorIndex}
            onSelectColor={handleSelectColor}
            onColorChange={handleColorChange}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
