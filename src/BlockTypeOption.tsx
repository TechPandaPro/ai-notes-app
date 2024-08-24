import { MouseEvent, ReactNode } from "react";

interface BlockTypeOptionProps {
  id: string;
  isTextOption: boolean;
  svg: ReactNode;
  isSelected: boolean;
  onSelectOption: (typeId: string) => void;
}

export default function BlockTypeOption({
  id,
  isTextOption,
  svg,
  isSelected,
  onSelectOption,
}: BlockTypeOptionProps) {
  // TODO: focus block when selecting block type option

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  function handleClick() {
    onSelectOption(id);
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
