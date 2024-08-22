import { useEffect, useRef, useState } from "react";

interface BlockAddInlineProps {
  createAtIndex: number;
  onAddBlock: (blockIndex: number) => void;
}

export default function BlockAddInline({
  createAtIndex,
  onAddBlock,
}: BlockAddInlineProps) {
  const [showButton, setShowButton] = useState<boolean>(true);
  const blockAddInlineRef = useRef<HTMLDivElement>(null);

  function checkRegion(e: MouseEvent) {
    if (!blockAddInlineRef.current) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const blockAddInlineRect =
      blockAddInlineRef.current.getBoundingClientRect();
    const {
      left: addX,
      top: addY,
      width: addWidth,
      height: addHeight,
    } = blockAddInlineRect;
    setShowButton(
      !!(
        mouseX > addX &&
        mouseX < addX + addWidth &&
        mouseY > addY &&
        mouseY < addY + addHeight
      )
    );
  }

  useEffect(() => {
    window.addEventListener("mousemove", checkRegion);
    return () => window.removeEventListener("mousemove", checkRegion);
  }, []);

  return (
    <div
      className={`blockAddContainerVertical ${showButton ? "show" : ""}`}
      ref={blockAddInlineRef}
    >
      {/* <div
    className="blockAddRegionVertical"
    onClick={() => console.log("create")}
  ></div> */}
      <div
        className="blockAddInnerVertical"
        onClick={() => onAddBlock(createAtIndex)}
      ></div>
    </div>
  );
}
