interface DeleteBlockProps {
  deleteIndex: number;
  onDeleteBlock: (deleteBlockIndex: number) => void;
}

export default function DeleteBlock({
  deleteIndex,
  onDeleteBlock,
}: DeleteBlockProps) {
  function handleClick() {
    onDeleteBlock(deleteIndex);
  }

  return <div className="deleteBlock" onClick={handleClick}></div>;
}
