import { MouseEvent, ReactNode } from "react";

interface BlockImageControlProps {
  id: string;
  svg: ReactNode;
  onClick: (controlId: string) => void;
}

export default function BlockImageControl({
  id,
  svg,
  onClick,
}: BlockImageControlProps) {
  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onClick(id);
  }

  return (
    <div className="imageControl" onClick={handleClick}>
      {svg}
    </div>
  );
}
