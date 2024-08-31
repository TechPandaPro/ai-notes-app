// import { createRoot } from "react-dom/client";

// import DragRegion from "./DragRegion";
import { useEffect, useState } from "react";
import NoteContent from "./NoteContent";
import Toolbar from "./Toolbar";
import { BlockGroupInfo, BlockType, Tab } from "./types";
import { ContextBridgeApi } from "./preload";
// import { Tab } from "./ToolbarTab";

// const root = createRoot(document.body);
// root.render(<h2>Hello from React!</h2>);

declare global {
  interface Window {
    electronApi: ContextBridgeApi;
  }
}

export default function App() {
  // const files = ["my note", "Class Notes", "Project ideas"];

  const currDate = Date.now();

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: `${currDate}_0`,
      name: "my note",
      current: true,
      blockGroups: [
        {
          blocks: [
            {
              type: BlockType.Header,
              text: "Welcome to the AI Notes app!",
              imgUrl: null,
              attemptLoad: false,
              key: `${currDate}_0`,
              moving: false,
              position: null,
            },
          ],
          colorIndex: 0,
          key: `${currDate}_0_${currDate}_0`,
          moving: false,
          position: null,
          previewIndex: null,
        },
        {
          blocks: [
            {
              type: BlockType.Text,
              text: "you can type in each of these blocks!",
              imgUrl: null,
              attemptLoad: false,
              key: `${currDate}_1`,
              moving: false,
              position: null,
            },
            {
              type: BlockType.Text,
              text: "each row has its own set of blocks!",
              imgUrl: null,
              attemptLoad: false,
              key: `${currDate}_2`,
              moving: false,
              position: null,
            },
          ],
          colorIndex: 0,
          key: `${currDate}_0_${currDate}_1`,
          moving: false,
          position: null,
          previewIndex: null,
        },
        {
          blocks: [
            {
              type: BlockType.Text,
              text: "you can add images to blocks, too!",
              imgUrl: null,
              attemptLoad: false,
              key: `${currDate}_0`,
              moving: false,
              position: null,
            },
            {
              type: BlockType.AI,
              text: "[add an image here]",
              imgUrl: null,
              attemptLoad: false,
              key: `${currDate}_1`,
              moving: false,
              position: null,
            },
          ],
          colorIndex: 0,
          key: `${currDate}_0_${currDate}_2`,
          moving: false,
          position: null,
          previewIndex: null,
        },
      ],
    },
    {
      id: `${currDate}_1`,
      name: "Class Notes",
      current: false,
      blockGroups: [
        {
          blocks: [
            {
              type: BlockType.Text,
              text: "",
              imgUrl: "",
              attemptLoad: false,
              key: `${currDate}_0`,
              moving: false,
              position: null,
            },
          ],
          colorIndex: 0,
          key: `${currDate}_1_${currDate}_0`,
          moving: false,
          position: null,
          previewIndex: null,
        },
      ],
    },
    {
      id: `${currDate}_2`,
      name: "Project ideas",
      current: false,
      blockGroups: [
        {
          blocks: [
            {
              type: BlockType.Text,
              text: "",
              imgUrl: "",
              attemptLoad: false,
              key: `${Date.now()}_0`,
              moving: false,
              position: null,
            },
          ],
          colorIndex: 0,
          key: `${currDate}_2_${Date.now()}_0`,
          moving: false,
          position: null,
          previewIndex: null,
        },
      ],
    },
  ]);

  function handleSelectTab(id: string) {
    const toSelectTabIndex = tabs.findIndex((tab) => tab.id === id);
    selectTab(toSelectTabIndex);
  }

  // TODO: consider what new tab should open on
  // probably just with empty blockGroups, but it might be convenient to also have a page on which the user can open particular tabs (in which case the user could close tabs too)
  function handleCreateTab() {
    createTab();
  }

  function selectTab(toSelectTabIndex: number) {
    const nextTabs = tabs.slice();

    const currentTabIndex = tabs.findIndex((tab) => tab.current);
    const nextCurrentTab = { ...nextTabs[currentTabIndex] };
    nextTabs[currentTabIndex] = nextCurrentTab;
    nextCurrentTab.current = false;

    // const toSelectTabIndex = tabs.findIndex((tab) => tab.id === id);
    const nextSelectedTab = { ...nextTabs[toSelectTabIndex] };
    nextTabs[toSelectTabIndex] = nextSelectedTab;
    nextSelectedTab.current = true;

    setTabs(nextTabs);
  }

  function createTab() {
    // FIXME: generate ID properly (refer to generateKey() in NoteContent)

    const newNoteCount = tabs.filter((tab) =>
      tab.name.startsWith("New Note")
    ).length;

    // const noteId = `${currDate}_0`;

    const noteId = generateTabKey();

    const nextTabs = tabs.slice();

    const currentTabIndex = tabs.findIndex((tab) => tab.current);
    const nextCurrentTab = { ...nextTabs[currentTabIndex] };
    nextTabs[currentTabIndex] = nextCurrentTab;
    nextCurrentTab.current = false;

    nextTabs.push({
      id: noteId,
      name: `New Note${newNoteCount >= 1 ? ` ${newNoteCount}` : ""}`,
      current: true,
      blockGroups: [
        {
          blocks: [
            {
              type: BlockType.Text,
              text: "",
              imgUrl: "",
              attemptLoad: false,
              key: `${Date.now()}_0`,
              moving: false,
              position: null,
            },
          ],
          colorIndex: 0,
          key: `${noteId}_${Date.now()}_0`,
          moving: false,
          position: null,
          previewIndex: null,
        },
      ],
    });

    setTabs(nextTabs);
  }

  function createWindow() {
    // create new window here
    window.electronApi.createWindow();
  }

  function generateTabKey() {
    const stamp = Date.now();
    const foundCount = tabs.filter(
      (tab) => tab.id && tab.id.startsWith(`${stamp}_`)
    ).length;
    return `${stamp}_${foundCount}`;
  }

  function handleBlockGroupsUpdate(
    id: string,
    nextBlockGroups: BlockGroupInfo[]
  ) {
    console.log("update block group!");

    const nextTabs = tabs.slice();

    const currentTabIndex = tabs.findIndex((tab) => tab.current);
    const nextTab = { ...nextTabs[currentTabIndex] };
    if (nextTab.id !== id)
      throw new Error("Tab mismatch while updating block groups");
    nextTabs[currentTabIndex] = nextTab;
    nextTab.blockGroups = nextBlockGroups;

    setTabs(nextTabs);
  }

  // TODO: add close note button

  function handleKeydown(e: KeyboardEvent) {
    console.log(e.key);

    // TODO: meta key + w = close note, meta key + shift + w = close window

    // console.log(e);
    if (e.key === "Tab" && e.ctrlKey) {
      const currTabIndex = tabs.findIndex((tab) => tab.current);
      let selectTabIndex: number;
      if (e.shiftKey) {
        selectTabIndex =
          currTabIndex === 0 ? tabs.length - 1 : currTabIndex - 1;
        console.log("prev tab");
      } else {
        selectTabIndex =
          currTabIndex === tabs.length - 1 ? 0 : currTabIndex + 1;
        console.log("next tab");
      }
      selectTab(selectTabIndex);
    } else if (!Number.isNaN(Number(e.key)) && e.metaKey) {
      const index = Number(e.key) - 1;
      console.log(`select ${index}`);
      if (index <= tabs.length - 1) {
        console.log(`select ${index}`);
        selectTab(index);
      }
    } else if (e.key === "t" && e.metaKey) {
      console.log("create tab");
      createTab();
    } else if (e.key === "n" && e.metaKey) {
      console.log("create window");
      createWindow();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [tabs]);

  useEffect(() => {
    window.electronApi.onCreateTab(createTab);
    return () => window.electronApi.offCreateTab(createTab);
  }, []);

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

  const currentTab = tabs.find((tab) => tab.current);

  if (!currentTab) return <p>No selected tab</p>;

  // TODO: using ctrl+tab should navigate to next tab
  // TODO: save scroll position
  return (
    <>
      {/* <DragRegion /> */}
      <Toolbar
        tabs={tabs}
        onSelectTab={handleSelectTab}
        onCreateTab={handleCreateTab}
      />
      <NoteContent
        id={currentTab.id}
        blockGroups={currentTab.blockGroups}
        onBlockGroupsUpdate={handleBlockGroupsUpdate}
      />
    </>
  );
}
