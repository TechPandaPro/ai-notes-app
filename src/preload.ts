// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { StoreWindowInterface, Tab } from "./types";

export interface ContextBridgeApi {
  // onSetId: (callback: (event: IpcRendererEvent, id: string) => void) => void;
  offSetId: (callback: (event: IpcRendererEvent, id: string) => void) => void;
  onCreateTab: (callback: () => void) => void;
  offCreateTab: (callback: () => void) => void;
  // onSaveData: (callback: () => void) => void;
  // offSaveData: (callback: () => void) => void;
  getId: () => Promise<string | null>;
  // requestWindowId: () => void;
  saveData: (id: string, data: Tab[]) => void;
  createWindow: () => void;
  getWindowFromStore: (id: string) => Promise<StoreWindowInterface | null>;
}

const contextBridgeApi: ContextBridgeApi = {
  // onSetId: (callback) => ipcRenderer.on("set-id", callback),
  offSetId: (callback) => ipcRenderer.off("set-id", callback),
  onCreateTab: (callback) => ipcRenderer.on("create-tab", callback),
  offCreateTab: (callback) => ipcRenderer.off("create-tab", callback),
  // onSaveData: (callback) => ipcRenderer.on("get-data", callback),
  // offSaveData: (callback) => ipcRenderer.off("get-data", callback),
  getId: () => ipcRenderer.invoke("get-id"),
  // requestWindowId: () => ipcRenderer.invoke("request-id"),
  // ipcRenderer.on("get-data", (_event, data) => callback(data)),
  saveData: (id, data) => ipcRenderer.invoke("save-data", id, data),
  createWindow: () => ipcRenderer.invoke("create-window"),
  getWindowFromStore: (id) => ipcRenderer.invoke("get-window-from-store", id),
};

contextBridge.exposeInMainWorld("electronApi", contextBridgeApi);
