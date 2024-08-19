import { MouseEvent as ReactMouseEvent, useRef, useState } from "react";

interface PositionInterface {
  x: number;
  y: number;
}

interface OffsetInterface {
  offsetX: number;
  offsetY: number;
}

// TODO: prevent mouse events on other elems from registering while moving = true
// TODO: prevent scrollbars when dragged off the page
export default function BlockMarker() {
  const [position, setPosition] = useState<PositionInterface | null>(null);
  const [offset, setOffset] = useState<OffsetInterface | null>(null);
  const [moving, setMoving] = useState<boolean>(false);

  const blockMarkerRef = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    const blockMarkerRect = (
      e.target as HTMLDivElement
    ).getBoundingClientRect();

    setOffset({
      // offsetX: e.clientX - blockMarkerRect.left,
      // offsetY: e.clientY - blockMarkerRect.top,
      // offsetX: e.nativeEvent.offsetX,
      // offsetY: e.nativeEvent.offsetY,
      offsetX: blockMarkerRect.width / 2 - e.nativeEvent.offsetX,
      offsetY: blockMarkerRect.height / 2 - e.nativeEvent.offsetY,
    });

    window.addEventListener("mousemove", updateMouseState);

    setMoving(true);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", updateMouseState);

    setPosition(null);
    setOffset(null);

    setMoving(false);
  }

  function updateMouseState(e: MouseEvent) {
    // const blockMarker = (e.target as HTMLDivElement).parentElement;
    const parentRect =
      blockMarkerRef.current.parentElement.getBoundingClientRect();
    setPosition({
      x: e.clientX - parentRect.left,
      y: e.clientY - parentRect.top,
    });
  }

  // useEffect(() => {
  //   window.addEventListener("mousemove", updateMouseState);
  //   return () => window.removeEventListener("mousemove", updateMouseState);
  // }, []);

  console.log(position);

  return (
    <div
      ref={blockMarkerRef}
      className={`blockMarker ${moving ? "moving" : ""}`}
      style={
        moving && position
          ? {
              left: position.x + offset.offsetX,
              top: position.y + offset.offsetY,
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
  );
}
