interface BlockPreviewProps {
  previewIndex: 0 | 1 | null;
  text: string[];
}

export default function BlockPreview({
  previewIndex,
  text,
}: BlockPreviewProps) {
  return (
    <div
      className={`blockPreview ${
        previewIndex === null ? "" : ["left", "right"][previewIndex]
      }`}
    >
      {text}
    </div>
  );
}
