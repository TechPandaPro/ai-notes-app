// import { useState } from "react";
import ToolbarTab from "./ToolbarTab";
import { Tab } from "./types";

interface ToolbarTabsProps {
  tabs: Tab[];
  onSelectTab: (id: string) => void;
}

// TODO: ability to drag tabs

export default function ToolbarTabs({ tabs, onSelectTab }: ToolbarTabsProps) {
  // const [prevCurrentId, setPrevCurrentId] = useState<string | null>(null);

  // const currentId = tabs.find((tab) => tab.current)?.id ?? null;

  // if (currentId !== prevCurrentId) {
  //   console.log("scroll into view");
  //   setPrevCurrentId(currentId);
  // }

  function handleSelectTab(id: string) {
    onSelectTab(id);
  }

  return (
    <div className="openTabs">
      {tabs.map((tab) => (
        // <div className={`openTab ${file.current ? "current" : ""}`}>
        //   {file.name}
        // </div>
        <ToolbarTab
          key={tab.id}
          id={tab.id}
          name={tab.name}
          current={tab.current}
          onSelectTab={handleSelectTab}
        />
      ))}
    </div>
  );
}
