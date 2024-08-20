interface BlockPreviewProps {
  previewIndex: 0 | 1 | null;
}

export default function BlockPreview({ previewIndex }: BlockPreviewProps) {
  return (
    <div
      className={`blockPreview ${
        previewIndex === null ? "" : ["left", "right"][previewIndex]
      }`}
    ></div>
  );
}
