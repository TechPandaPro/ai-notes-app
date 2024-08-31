// import ToolbarTab, { Tab } from "./ToolbarTab";
import ToolbarTab from "./ToolbarTab";

interface ToolbarProps {
  // openFiles: { name: string; current: boolean }[];
  openFiles: { id: string; name: string; current: boolean }[];
  onSelectTab: (id: string) => void;
}

export default function Toolbar({ openFiles, onSelectTab }: ToolbarProps) {
  function handleSelectTab(id: string) {
    console.log(id);
    onSelectTab(id);
  }

  return (
    <div className="toolbar">
      <div className="toolbarDragRegion"></div>
      {openFiles.map((file) => (
        // <div className={`openTab ${file.current ? "current" : ""}`}>
        //   {file.name}
        // </div>
        <ToolbarTab
          key={file.id}
          id={file.id}
          name={file.name}
          current={file.current}
          onSelectTab={handleSelectTab}
        />
      ))}
      <div className="toolbarDragRegion"></div>
    </div>
  );
}
