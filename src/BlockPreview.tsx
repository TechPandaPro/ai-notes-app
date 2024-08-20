import { BlockInfo } from "./NoteContent";

interface BlockPreviewProps {
  previewIndex: 0 | 1 | null;
  texts: BlockInfo[];
}

export default function BlockPreview({
  previewIndex,
  texts,
}: BlockPreviewProps) {
  return (
    <div
      className={`blockPreview ${
        previewIndex === null ? "" : ["left", "right"][previewIndex]
      }`}
    >
      {/* FIXME: make multiple texts work with block preview */}
      {texts.map((text) => text.text).join(", ")}
    </div>
  );
}
