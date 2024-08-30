// TODO: maybe make it possible to change BlockMarker color

import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useState,
  // useRef,
  // useState,
} from "react";

interface PositionInterface {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export type Position = PositionInterface | null;

interface BlockMarkerPropsBase {
  blockGroupIndex: number;
  moving: boolean;
  position: Position;
  onMove: (blockGroupIndex: number, position: Position) => void;
  onCancelMove: (blockGroupIndex: number) => void;
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

export default function BlockMarker({
  blockGroupIndex,
  position,
  moving,
  onMove,
  onCancelMove,
}: BlockMarkerProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [colorPickerIsOpen, setColorPickerIsOpen] = useState<boolean>(false);

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

  function handleMouseUp(e: ReactMouseEvent) {
    if (!mouseDown && !moving) return;

    // window.removeEventListener("mousemove", updateMouseState);

    e.preventDefault();

    // setPosition(null);
    // setOffset(null);

    if (moving) onMove(blockGroupIndex, null);
    else {
      // TODO: open color picker
      // in color picker: default of ~8 colors, colors should have lower opacity before hover, fully opaque when hovering, right click color for custom hex input (probably an input[type="color"])
      console.log("open color picker");
      setColorPickerIsOpen(true);
    }

    setMouseDown(false);

    // setMoving(false);
  }

  function updateMouseState(e: MouseEvent) {
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
      onMove(blockGroupIndex, {
        x: e.clientX,
        y: e.clientY,
        width: position.width,
        height: position.height,
        offsetX: position.offsetX,
        offsetY: position.offsetY,
      });
    else {
      console.log("start move");

      const blockMarkerRect = (
        e.target as HTMLDivElement
      ).getBoundingClientRect();

      onMove(blockGroupIndex, {
        x: e.clientX,
        y: e.clientY,
        width: blockMarkerRect.width,
        height: blockMarkerRect.height,
        offsetX: blockMarkerRect.width / 2 - e.offsetX,
        offsetY: blockMarkerRect.height / 2 - e.offsetY,
      });
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    console.log(e.key);
    // if (e.key === "Backspace" && e.shiftKey) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      console.log("reset move");
      onCancelMove(blockGroupIndex);
    }
  }

  useEffect(() => {
    if (mouseDown || moving) {
      window.addEventListener("mousemove", updateMouseState);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("mousemove", updateMouseState);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mouseDown, position]);

  // useEffect(() => {
  //   window.addEventListener("mousemove", updateMouseState);
  //   return () => window.removeEventListener("mousemove", updateMouseState);
  // }, []);

  return (
    <>
      {moving ? <div className="blockMarkerOverlay"></div> : ""}
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
          onMouseUp={handleMouseUp}
        ></div>
      </div>
    </>
  );
}
