import BlockPreview from "./BlockPreview";
import { BlockInfo } from "./NoteContent";

interface BlockGroupPreviewProps {
  blocks: BlockInfo[];
}

export default function BlockGroupPreview({ blocks }: BlockGroupPreviewProps) {
  return (
    <div className="blockGroupPreview" style={{ flexGrow: blocks.length }}>
      {blocks.map((text) => (
        <BlockPreview key={text.key} text={text} />
      ))}
    </div>
  );
}
