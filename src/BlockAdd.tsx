interface BlockAddProps {
  createAtIndex: number;
  onAddBlock: (createAtIndex: number) => void;
}

export default function BlockAdd({ createAtIndex, onAddBlock }: BlockAddProps) {
  return (
    <div className="blockAddContainer">
      <div
        className="blockAddRegion"
        onClick={() => onAddBlock(createAtIndex)}
      ></div>
      <div className="blockAdd" onClick={() => onAddBlock(createAtIndex)}>
        <div className="blockAddInner"></div>
      </div>
    </div>
  );
}
