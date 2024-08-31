// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Tab } from "./types";

export interface ContextBridgeApi {
  onCreateTab: (callback: () => void) => void;
  offCreateTab: (callback: () => void) => void;
  onSaveData: (callback: () => void) => void;
  offSaveData: (callback: () => void) => void;
  saveData: (data: Tab[]) => void;
  createWindow: () => Promise<void>;
}

const contextBridgeApi: ContextBridgeApi = {
  onCreateTab: (callback) => ipcRenderer.on("create-tab", callback),
  offCreateTab: (callback) => ipcRenderer.off("create-tab", callback),
  onSaveData: (callback) => ipcRenderer.on("get-data", callback),
  offSaveData: (callback) => ipcRenderer.off("get-data", callback),
  // ipcRenderer.on("get-data", (_event, data) => callback(data)),
  saveData: (data) => ipcRenderer.invoke("save-data", data),
  createWindow: () => ipcRenderer.invoke("create-window"),
};

contextBridge.exposeInMainWorld("electronApi", contextBridgeApi);
