import { useEffect, useRef, useState } from "react";

interface BlockAddInlineProps {
  createAtIndex: number;
  position: -1 | 0 | 1;
  onAddBlock: (blockIndex: number) => void;
}

export default function BlockAddInline({
  createAtIndex,
  position,
  onAddBlock,
}: BlockAddInlineProps) {
  const [showButton, setShowButton] = useState<boolean>(false);
  const blockAddInlineRef = useRef<HTMLDivElement>(null);

  function handleClick() {
    setShowButton(false);
    onAddBlock(createAtIndex);
  }

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
      className={`blockAddContainerInline ${showButton ? "show" : ""} ${
        ["left", "middle", "right"][position + 1]
      }`}
      ref={blockAddInlineRef}
    >
      {/* <div
    className="blockAddRegionVertical"
    onClick={() => console.log("create")}
  ></div> */}
      <div className="blockAddInnerInline" onClick={handleClick}></div>
    </div>
  );
}
