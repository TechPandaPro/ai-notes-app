// import ToolbarTab, { Tab } from "./ToolbarTab";
import ToolbarCreateTab from "./ToolbarCreateTab";
// import ToolbarTab from "./ToolbarTab";
import ToolbarTabs from "./ToolbarTabs";
import { Tab } from "./types";

// TODO: maybe don't show the toolbar shadow if the content is scrolled to top

interface ToolbarProps {
  // openFiles: { name: string; current: boolean }[];
  tabs: Tab[];
  onSelectTab: (id: string) => void;
  onCreateTab: () => void;
}

export default function Toolbar({
  tabs,
  onSelectTab,
  onCreateTab,
}: ToolbarProps) {
  function handleSelectTab(id: string) {
    console.log(id);
    onSelectTab(id);
  }

  function handleCreateTab() {
    onCreateTab();
  }

  return (
    <div className="toolbar">
      <div className="toolbarDragRegion first"></div>
      {/* <div className="openTabs">
        {tabs.map((file) => (
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
      </div> */}
      <ToolbarTabs tabs={tabs} onSelectTab={handleSelectTab} />
      <div className="toolbarDragRegion last"></div>
      <ToolbarCreateTab onCreateTab={handleCreateTab} />
    </div>
  );
}
