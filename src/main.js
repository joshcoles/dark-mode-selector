import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import Store from "electron-store";
import path from "node:path";
import started from "electron-squirrel-startup";

if (started) {
  app.quit();
}

const store = new Store();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Send any previously-saved theme to the renderer process
  mainWindow.webContents.once("did-finish-load", () => {
    const savedTheme = store.get("theme", "system");
    mainWindow.webContents.send("theme:update", savedTheme);
  });
};

// Handle darkModeSettings invocations from the renderer process
ipcMain.handle("dark-mode:set-light", () => {
  nativeTheme.themeSource = "light";
  store.set("theme", "light");
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:set-dark", () => {
  nativeTheme.themeSource = "dark";
  store.set("theme", "dark");
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
  store.set("theme", "system");
});

app.whenReady().then(() => {
  // Set the theme to electron-store saved value,
  // defaulting to system value if not found
  const savedTheme = store.get("theme", "system");
  nativeTheme.themeSource = savedTheme;

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
