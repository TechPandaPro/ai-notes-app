import { ReactNode } from "react";

interface BlockTypeOptionProps {
  id: string;
  isTextOption: boolean;
  svg: ReactNode;
}

export default function BlockTypeOption({
  id,
  isTextOption,
  svg,
}: BlockTypeOptionProps) {
  return (
    <div
      className={`blockTypeOption ${isTextOption ? "blockTypeTextOption" : ""}`}
    >
      {svg}
    </div>
  );
}
