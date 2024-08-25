import { MouseEvent, ReactNode } from "react";

export enum BlockType {
  Text = "TEXT",
  Header = "HEADER",
  Image = "IMAGE",
}

// export type BlockTypeId = "text" | "header" | "image";

interface BlockTypeOptionProps {
  type: BlockType;
  isTextOption: boolean;
  svg: ReactNode;
  isSelected: boolean;
  onSelectOption: (type: BlockType) => void;
}

export default function BlockTypeOption({
  type,
  isTextOption,
  svg,
  isSelected,
  onSelectOption,
}: BlockTypeOptionProps) {
  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  function handleClick() {
    onSelectOption(type);
  }

  return (
    <div
      className={`blockTypeOption ${
        isTextOption ? "blockTypeTextOption" : ""
      } ${isSelected ? "selected" : ""}`}
      // data-selected={isSelected}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {svg}
    </div>
  );
}
