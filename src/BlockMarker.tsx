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

interface BlockMarkerProps {
  blockIndex: number;
  position: Position;
  moving: boolean;
  onMove: (blockIndex: number, position: Position) => void;
}

export default function BlockMarker({
  blockIndex,
  position,
  moving,
  onMove,
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

    onMove(blockIndex, {
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
    // window.removeEventListener("mousemove", updateMouseState);

    e.preventDefault();

    // setPosition(null);
    // setOffset(null);

    onMove(blockIndex, null);

    // setMoving(false);
  }

  function updateMouseState(e: MouseEvent) {
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

    onMove(blockIndex, {
      x: e.clientX,
      y: e.clientY,
      width: position.width,
      height: position.height,
      offsetX: position.offsetX,
      offsetY: position.offsetY,
    });
  }

  useEffect(() => {
    if (moving) {
      window.addEventListener("mousemove", updateMouseState);
      return () => window.removeEventListener("mousemove", updateMouseState);
    }
  });

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
