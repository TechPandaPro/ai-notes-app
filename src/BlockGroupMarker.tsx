// TODO: maybe make it possible to change BlockMarker color

import {
  MouseEvent as ReactMouseEvent,
  useEffect,
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
  // const [position, setPosition] = useState<PositionInterface | null>(null);
  // const [moving, setMoving] = useState<boolean>(false);

  // const blockMarkerRef = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: ReactMouseEvent) {
    if (moving) return;

    e.preventDefault();

    const blockMarkerRect = (
      e.target as HTMLDivElement
    ).getBoundingClientRect();

    // const parentRect =
    //   blockMarkerRef.current.parentElement.getBoundingClientRect();

    // setPosition({
    //   // x: e.clientX - parentRect.left,
    //   // y: e.clientY - parentRect.top,
    //   x: e.clientX,
    //   y: e.clientY,
    //   width: blockMarkerRect.width,
    //   height: blockMarkerRect.height,
    //   offsetX: blockMarkerRect.width / 2 - e.nativeEvent.offsetX,
    //   offsetY: blockMarkerRect.height / 2 - e.nativeEvent.offsetY,
    // });

    onMove(blockGroupIndex, {
      x: e.clientX,
      y: e.clientY,
      width: blockMarkerRect.width,
      height: blockMarkerRect.height,
      offsetX: blockMarkerRect.width / 2 - e.nativeEvent.offsetX,
      offsetY: blockMarkerRect.height / 2 - e.nativeEvent.offsetY,
    });

    // window.addEventListener("mousemove", updateMouseState);

    // setMoving(true);
  }

  function handleMouseUp(e: ReactMouseEvent) {
    if (!moving) return;

    // window.removeEventListener("mousemove", updateMouseState);

    e.preventDefault();

    // setPosition(null);
    // setOffset(null);

    onMove(blockGroupIndex, null);

    // setMoving(false);
  }

  function updateMouseState(e: MouseEvent) {
    if (!moving) return;

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

    onMove(blockGroupIndex, {
      x: e.clientX,
      y: e.clientY,
      width: position.width,
      height: position.height,
      offsetX: position.offsetX,
      offsetY: position.offsetY,
    });
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
    if (moving) {
      window.addEventListener("mousemove", updateMouseState);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("mousemove", updateMouseState);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [position]);

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
