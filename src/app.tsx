// import { createRoot } from "react-dom/client";

// import DragRegion from "./DragRegion";
import { useState } from "react";
import NoteContent from "./NoteContent";
import NoteToolbar from "./Toolbar";
// import { Tab } from "./ToolbarTab";

// const root = createRoot(document.body);
// root.render(<h2>Hello from React!</h2>);

export default function App() {
  // const files = ["my note", "Class Notes", "Project ideas"];

  const [tabs, setTabs] = useState<
    {
      id: string;
      name: string;
      current: boolean;
    }[]
  >([
    { id: `${Date.now()}_0`, name: "my note", current: true },
    { id: `${Date.now()}_1`, name: "Class Notes", current: false },
    { id: `${Date.now()}_2`, name: "Project ideas", current: false },
  ]);

  function handleSelectTab(id: string) {
    const nextTabs = tabs.slice();

    const currentTabIndex = tabs.findIndex((tab) => tab.current);
    const nextCurrentTab = { ...nextTabs[currentTabIndex] };
    nextTabs[currentTabIndex] = nextCurrentTab;
    nextCurrentTab.current = false;

    const toSelectTabIndex = tabs.findIndex((tab) => tab.id === id);
    const nextSelectedTab = { ...nextTabs[toSelectTabIndex] };
    nextTabs[toSelectTabIndex] = nextSelectedTab;
    nextSelectedTab.current = true;

    setTabs(nextTabs);
  }

  function handleDataUpdate() {}

  // setTabs([
  //   { id: `${Date.now()}_0`, name: "my note", current: true },
  //   { id: `${Date.now()}_1`, name: "Class Notes", current: false },
  //   { id: `${Date.now()}_2`, name: "Project ideas", current: false },
  // ]);

  // TODO: add typings back to this
  // const tabs: Tab[] = [
  // const tabs = [
  //   { id: `${Date.now()}_0`, name: "my note", current: true },
  //   { id: `${Date.now()}_1`, name: "Class Notes", current: false },
  //   { id: `${Date.now()}_2`, name: "Project ideas", current: false },
  // ];

  // TODO: using ctrl+tab should navigate to next tab
  return (
    <>
      {/* <DragRegion /> */}
      <NoteToolbar openFiles={tabs} onSelectTab={handleSelectTab} />
      <NoteContent onDataUpdate={handleDataUpdate} />
    </>
  );
}
