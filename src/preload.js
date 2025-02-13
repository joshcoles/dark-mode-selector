import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("darkModeSettings", {
  applyLight: () => ipcRenderer.invoke("dark-mode:set-light"),
  applyDark: () => ipcRenderer.invoke("dark-mode:set-dark"),
  applySystem: () => ipcRenderer.invoke("dark-mode:system"),
  onThemeUpdate: (callback) =>
    ipcRenderer.on("theme:update", (_event, value) => callback(value)),
});
