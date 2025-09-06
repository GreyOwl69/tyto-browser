import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const electronAPI = {
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
    on: (channel: string, listener: (...args: unknown[]) => void) => {
      const handler = (_event: IpcRendererEvent, ...args: unknown[]) => listener(...args);
      ipcRenderer.on(channel, handler);
      return () => ipcRenderer.removeListener(channel, handler);
    },
    once: (channel: string, listener: (...args: unknown[]) => void) => {
      ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args: unknown[]) => listener(...args));
    },
    invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);

export type ElectronHandler = typeof electronAPI;
