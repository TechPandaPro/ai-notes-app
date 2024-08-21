import BlockPreview from "./BlockPreview";
import { BlockInfo } from "./NoteContent";

interface BlockGroupPreviewProps {
  texts: BlockInfo[];
}

export default function BlockGroupPreview({ texts }: BlockGroupPreviewProps) {
  return (
    <div className="blockGroupPreview" style={{ flexGrow: texts.length }}>
      {texts.map((text) => (
        <BlockPreview key={text.key} text={text} />
      ))}
    </div>
  );
}
