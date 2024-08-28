import { MouseEvent, ReactNode } from "react";

interface BlockAIButtonProps {
  id: string;
  title: string;
  svg: ReactNode;
  onClick: (buttonId: string) => void;
}

export default function BlockAIButton({
  id,
  title,
  svg,
  onClick,
}: BlockAIButtonProps) {
  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onClick(id);
  }

  return (
    <div
      title={title}
      className="aiBlockInnerHeaderButton"
      onClick={handleClick}
    >
      {svg}
    </div>
  );
}
