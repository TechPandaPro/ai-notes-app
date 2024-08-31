// import { useState } from "react";
import BlockColorOption from "./BlockColorOption";

interface BlockColorPickerProps {
  colors: string[];
  colorIndex: number;
  onSelectColor: (colorIndex: number) => void;
  onColorChange: (colorIndex: number, hex: string) => void;
}

export default function BlockColorPicker({
  colors,
  colorIndex,
  onSelectColor,
  onColorChange,
}: BlockColorPickerProps) {
  // const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  // const colors = [
  //   "#ffff00", // yellow
  //   "#ffa500", // orange
  //   "#ff0000", // red
  //   "#add8e6", // light blue
  //   "#0000ff", // blue
  //   "#800080", // purple
  //   "#00ff00", // green
  //   "#006400", // dark green
  // ];

  // function handleSelectColor(color: string) {
  function handleSelectColor(colorIndex: number) {
    // console.log(colorIndex);
    // setSelectedColorIndex(colorIndex);
    onSelectColor(colorIndex);
  }

  function handleColorChange(colorIndex: number, hex: string) {
    onColorChange(colorIndex, hex);
  }

  return (
    <div className="blockColorPicker regionsIgnore">
      {colors.map((color, index) => (
        <BlockColorOption
          key={index}
          colorIndex={index}
          color={color}
          selected={colorIndex === index}
          onSelectColor={handleSelectColor}
          onColorChange={handleColorChange}
        />
        // <div
        //   key={index}
        //   className="blockColorPickerOption"
        //   style={{ backgroundColor: color }}
        //   onClick={handleClick}
        // ></div>
      ))}
    </div>
  );
}
