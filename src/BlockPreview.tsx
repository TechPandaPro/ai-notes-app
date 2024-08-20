import { BlockInfo } from "./NoteContent";

interface BlockPreviewProps {
  // previewIndex: 0 | 1 | null;
  text: BlockInfo;
}

export default function BlockPreview({
  // previewIndex,
  text,
}: BlockPreviewProps) {
  return (
    <div
      className="blockPreview"
      // className={`blockPreview ${
      //   previewIndex === null ? "" : ["left", "right"][previewIndex]
      // }`}
    >
      {/* FIXME: make multiple texts work with block preview */}
      {text.text}
    </div>
  );
}
