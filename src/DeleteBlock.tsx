import { MouseEvent } from "react";

interface DeleteBlockProps {
  // deleteIndex: number;
  // onDeleteBlock: (deleteBlockIndex: number) => void;
  onDeleteBlock: () => void;
}

export default function DeleteBlock({
  // deleteIndex,
  onDeleteBlock,
}: DeleteBlockProps) {
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    // onDeleteBlock(deleteIndex);
    onDeleteBlock();
  }

  return <div className="deleteBlock" onClick={handleClick}></div>;
}
