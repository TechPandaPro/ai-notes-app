import { BlockInfo } from "./NoteContent";

interface BlockPreviewProps {
  text: BlockInfo;
}

export default function BlockPreview({ text }: BlockPreviewProps) {
  return <div className="blockPreview">{text.text}</div>;
}
