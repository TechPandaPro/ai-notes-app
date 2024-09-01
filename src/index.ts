// import { app, BrowserWindow, ipcMain, Menu, MenuItem, session } from "electron";
import { app, BrowserWindow, ipcMain, Menu, session } from "electron";
import { StoreInterface, Tab } from "./types";
// import Store, { Schema } from "electron-store";
import Store from "electron-store";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// interface StoreInterface {
//   windows: { id: string; tabs: Tab[] }[];
// }

// const appStoreSchema: Schema<AppStore> = {};

const electronStore = new Store<StoreInterface>();

const openWindows: { id: string; browserWindow: BrowserWindow }[] = [];

const createNote = async (): Promise<void> => {
  console.log("clicked!! make a new note!");
  // TODO: new windows should be blank - default blocks should only exist in first window
  let targetWindow =
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  if (!targetWindow) {
    targetWindow = createWindow();
    await new Promise((resolve) =>
      targetWindow.webContents.once("did-finish-load", resolve)
    );
  }
  targetWindow.webContents.send("create-tab");
};

// const createWindow = async (): Promise<BrowserWindow> => {
const createWindow = (): BrowserWindow => {
  // TODO: maybe make new windows offset from others
  // TODO: save notes (probably with electron-store)
  // TODO: ensure the app works on windows

  // Create the browser window.
  const newWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: "hiddenInset",
    // titleBarStyle: "hidden",
    // trafficLightPosition: { x: 10, y: 20 },

    // background material is only supported on windows! :(
    // backgroundMaterial: "acrylic",
    // but macos has vibrancy, apparently!
    vibrancy: "popover",

    // could also use .setAlwaysOnTop() in order to set level/relativeLevel
    alwaysOnTop: true,

    // opacity: 0.5,
    transparent: true,
    visualEffectState: "active",
    // hasShadow: false,

    // focusable: false,

    minWidth: 200,
    minHeight: 150,
  });

  // TODO: add this line back
  // const windowId = generateWindowId();

  // const openWindowObj = {
  //   id: (electronStore.get("windows") ?? [])[0]?.id ?? generateWindowId(),
  //   browserWindow: newWindow,
  //   // awaitingClose: false,
  //   // canClose: false,
  // };

  // openWindows.push(openWindowObj);

  const existingWindowId = (electronStore.get("windows") ?? []).find(
    (storeWindow) =>
      !openWindows.some((openWindow) => storeWindow.id === openWindow.id)
  )?.id;

  const openWindow = {
    id: existingWindowId ?? generateWindowId(),
    browserWindow: newWindow,
  };

  openWindows.push(openWindow);

  // let awaitingClose = false;
  // let canClose = false;

  // newWindow.on("close", (e) => {
  // newWindow.on("close", () => {
  // if (!openWindowObj.canClose) {
  // e.preventDefault();
  // openWindowObj.awaitingClose = true;
  // newWindow.webContents.send("get-data");
  // }
  // });

  // TODO: make shortcuts work when no windows are open but app is focused
  // https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts/

  newWindow.on("closed", () => {
    // const windowIndex = openWindows.findIndex((win) => );
    const windowIndex = openWindows.indexOf(openWindow);
    if (windowIndex === -1) console.error("Could not find open window object");
    openWindows.splice(windowIndex, 1);
  });

  // and load the index.html of the app.
  newWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // await new Promise((resolve) =>
  //   newWindow.webContents.once("did-finish-load", resolve)
  // );

  // newWindow.webContents.send("set-id", windowId);

  return newWindow;

  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: "detach" }); // dev tools need to be detached with transparent window
};

const closeNote = async (): Promise<void> => {
  console.log("clicked!! close note!");
  // TODO: new windows should be blank - default blocks should only exist in first window
  const targetWindow =
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  if (!targetWindow) return;
  targetWindow.webContents.send("close-tab");
};

const closeWindow = async (): Promise<void> => {
  console.log("clicked!! close window!");
  const targetWindow = BrowserWindow.getFocusedWindow();
  if (targetWindow) targetWindow.close();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.openai.com",
        ],
      },
    });
  });

  // const menu = Menu.getApplicationMenu();
  // const menu = new Menu();
  // menu.append(
  //   new MenuItem({
  //     label: "hello!",
  //     submenu: [{ role: "help", click: () => console.log("clicked") }],
  //   })
  // );

  console.log(app.name);

  // TODO: consider adding more keybinds to this
  const applicationMenu = Menu.buildFromTemplate([
    {
      label: "Electron", // TODO: consider using app.name instead
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Note",
          accelerator: "Cmd+T",
          // TODO: add functionality
          click: createNote,
        },
        {
          label: "New Window",
          accelerator: "Cmd+N",
          // TODO: add functionality
          click: createWindow,
        },
        { type: "separator" },
        // { role: "close" },
        { label: "Close Note", accelerator: "Cmd+W", click: closeNote },
        {
          label: "Close Window",
          accelerator: "Cmd+Shift+W",
          click: closeWindow,
        },
        // { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        // TODO: add more to edit menu
      ],
    },
    { label: "View", submenu: [{ role: "toggleDevTools" }] },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "zoom" }],
    },
  ]);

  Menu.setApplicationMenu(applicationMenu);

  const dockMenu = Menu.buildFromTemplate([
    // TODO: add functionality to this button
    {
      label: "New Note",
      // TODO: check how accelerator works cross-platform
      // accelerator: "Cmd+T",
      async click() {
        console.log("clicked!! make a new note!");
        // // TODO: new windows should be blank - default blocks should only exist in first window
        // let targetWindow =
        //   BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
        // if (!targetWindow) {
        //   targetWindow = createWindow();
        //   await new Promise((resolve) =>
        //     targetWindow.webContents.once("did-finish-load", resolve)
        //   );
        // }
        // targetWindow.webContents.send("create-tab");
        createNote();
      },
    },
    {
      label: "New Window",
      accelerator: "Cmd+N",
      click() {
        console.log("clicked!! make a new window!");
        createWindow();
      },
    },
  ]);

  app.dock.setMenu(dockMenu);

  ipcMain.handle("get-id", (event) => {
    const window = openWindows.find(
      (win) => win.browserWindow.webContents.id === event.sender.id
    );
    return window ? window.id : null;
  });

  ipcMain.handle("save-data", (_event, id: string, data: Tab[]) => {
    console.log(data);
    const savedWindows = electronStore.get("windows") ?? [];
    let window = savedWindows.find((window) => window.id === id);
    if (window) {
      window.tabs = data;
    } else {
      window = { id, tabs: data };
      savedWindows.push(window);
    }
    console.log(savedWindows);
    electronStore.set("windows", savedWindows);

    // const openWindowObj = openWindows.find((win) => win.id === id);
    // if (openWindowObj && openWindowObj.awaitingClose) {
    // openWindowObj.canClose = true;
    // openWindowObj.browserWindow.close();
    // }
    // TODO: add distinction for which window. each window needs an id.
    // TODO: add data
    // electronStore.set("windows");
  });

  ipcMain.handle("create-window", () => {
    // do not return value
    createWindow();
  });

  ipcMain.handle("get-window-from-store", (_event, id: string) => {
    const savedWindows = electronStore.get("windows") ?? [];
    const window = savedWindows.find((window) => window.id === id);
    return window ?? null;
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function generateWindowId() {
  const windows = electronStore.get("windows") ?? [];
  const stamp = Date.now();
  const foundCount = windows.filter(
    (window) => window.id && window.id.startsWith(`${stamp}_`)
  ).length;
  return `${stamp}_${foundCount}`;
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
