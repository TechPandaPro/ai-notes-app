import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

interface BlockColorOptionProps {
  color: string;
  colorIndex: number;
  // onSelectColor: (color: string) => void;
  selected: boolean;
  onSelectColor: (colorIndex: number) => void;
  onColorChange: (colorIndex: number, hex: string) => void;
}

export default function BlockColorOption({
  color,
  colorIndex,
  selected,
  onSelectColor,
  onColorChange,
}: BlockColorOptionProps) {
  const [showingHexPicker, setShowingHexPicker] = useState<boolean>(false);

  const hexPickerRef = useRef<HTMLInputElement>(null);

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    if (e.button === 2) {
      setShowingHexPicker(true);
    }
  }

  function handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement).matches('input[type="color"]')) return;
    e.preventDefault();
    e.stopPropagation();
    onSelectColor(colorIndex);
  }

  function handleInput(e: FormEvent<HTMLInputElement>) {
    const hex = e.currentTarget.value;
    onColorChange(colorIndex, hex);
  }

  useEffect(() => {
    if (showingHexPicker && hexPickerRef.current) {
      console.log(hexPickerRef.current);
      // setTimeout(() => {
      hexPickerRef.current.offsetHeight;
      hexPickerRef.current?.click();
      // });
    }
  }, [showingHexPicker]);

  // if (showingHexPicker && hexPickerRef.current) hexPickerRef.current.click();

  return (
    <div
      className={`blockColorPickerOption ${selected ? "selected" : ""}`}
      style={{ backgroundColor: color }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {showingHexPicker ? (
        <input ref={hexPickerRef} type="color" onInput={handleInput} />
      ) : (
        ""
      )}
    </div>
  );
}
