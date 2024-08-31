// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

export interface ContextBridgeApi {
  onCreateTab: (callback: () => void) => void;
  offCreateTab: (callback: () => void) => void;
  createWindow: () => Promise<void>;
}

const contextBridgeApi: ContextBridgeApi = {
  onCreateTab: (callback) => ipcRenderer.on("create-tab", callback),
  offCreateTab: (callback) => ipcRenderer.off("create-tab", callback),
  createWindow: () => ipcRenderer.invoke("create-window"),
};

contextBridge.exposeInMainWorld("electronApi", contextBridgeApi);
