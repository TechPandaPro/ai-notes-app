interface BlockAddProps {
  createAtIndex: number;
  onAddBlock: (createAtIndex: number) => void;
}

export default function BlockAdd({ createAtIndex, onAddBlock }: BlockAddProps) {
  function handleClick() {
    onAddBlock(createAtIndex);
  }

  return (
    <div className="blockAddContainer">
      <div className="blockAddRegion" onClick={handleClick}></div>
      <div className="blockAdd" onClick={handleClick}>
        <div className="blockAddInner"></div>
      </div>
    </div>
  );
}
