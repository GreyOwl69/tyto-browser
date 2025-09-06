import path from 'path';
import { app, BrowserWindow, shell, ipcMain, nativeTheme } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// IPC TEST
ipcMain.handle('ipc-test', async () => {
  return 'pong';
});

// THEME IPC HANDLERS
ipcMain.handle('get-theme', () => ({
  isDark: nativeTheme.shouldUseDarkColors,
}));

ipcMain.handle('set-theme', (_, themeSource: 'system' | 'light' | 'dark') => {
  nativeTheme.themeSource = themeSource;
  return { isDark: nativeTheme.shouldUseDarkColors };
});

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
      webviewTag: true,
      backgroundThrottling: false,
      offscreen: false,
      experimentalFeatures: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // THEME HANDLING
  const updateTheme = () => {
    if (mainWindow) {
      mainWindow.webContents.send('theme-updated', {
        isDark: nativeTheme.shouldUseDarkColors,
      });
    }
  };

  nativeTheme.on('updated', updateTheme);
  mainWindow.webContents.once('did-finish-load', updateTheme);

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
