import { MouseEvent } from "react";

interface BlockColorOptionProps {
  color: string;
  colorIndex: number;
  // onSelectColor: (color: string) => void;
  selected: boolean;
  onSelectColor: (color: number) => void;
}

export default function BlockColorOption({
  color,
  colorIndex,
  selected,
  onSelectColor,
}: BlockColorOptionProps) {
  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSelectColor(colorIndex);
  }

  return (
    <div
      className={`blockColorPickerOption ${selected ? "selected" : ""}`}
      style={{ backgroundColor: color }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    ></div>
  );
}
