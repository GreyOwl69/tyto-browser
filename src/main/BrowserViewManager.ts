import { BrowserView, BrowserWindow } from 'electron';

export interface TabData {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export class BrowserViewManager {
  private mainWindow: BrowserWindow;
  private views: Map<string, BrowserView> = new Map();
  private activeViewId: string | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  createTab(tabId: string, url: string): BrowserView {
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        sandbox: false,
      }
    });

    // Set up event listeners
    this.setupViewEvents(view, tabId);
    
    view.webContents.loadURL(url);
    this.views.set(tabId, view);
    
    return view;
  }

  private setupViewEvents(view: BrowserView, tabId: string) {
    view.webContents.on('did-start-loading', () => {
      this.mainWindow.webContents.send('tab-loading-start', { tabId });
    });

    view.webContents.on('did-stop-loading', () => {
      this.mainWindow.webContents.send('tab-loading-stop', { 
        tabId,
        title: view.webContents.getTitle(),
        url: view.webContents.getURL(),
        canGoBack: view.webContents.canGoBack(),
        canGoForward: view.webContents.canGoForward()
      });
    });

    view.webContents.on('did-navigate', (event, url) => {
      this.mainWindow.webContents.send('tab-navigate', { 
        tabId, 
        url,
        canGoBack: view.webContents.canGoBack(),
        canGoForward: view.webContents.canGoForward()
      });
    });

    view.webContents.on('page-title-updated', (event, title) => {
      this.mainWindow.webContents.send('tab-title-update', { tabId, title });
    });
  }

  setActiveTab(tabId: string) {
    // Hide current active view
    if (this.activeViewId && this.views.has(this.activeViewId)) {
      const currentView = this.views.get(this.activeViewId)!;
      this.mainWindow.removeBrowserView(currentView);
    }

    // Show new active view
    const view = this.views.get(tabId);
    if (view) {
      this.mainWindow.setBrowserView(view);
      this.updateViewBounds();
      this.activeViewId = tabId;
    }
  }

  updateViewBounds() {
    if (this.activeViewId && this.views.has(this.activeViewId)) {
      const view = this.views.get(this.activeViewId)!;
      const bounds = this.mainWindow.getBounds();
      
      // Account for tab bar (40px) and navigation bar (48px)
      view.setBounds({
        x: 0,
        y: 88, // 40 + 48
        width: bounds.width,
        height: bounds.height - 88
      });
    }
  }

  closeTab(tabId: string) {
    const view = this.views.get(tabId);
    if (view) {
      if (this.activeViewId === tabId) {
        this.mainWindow.removeBrowserView(view);
        this.activeViewId = null;
      }
      view.webContents.destroy();
      this.views.delete(tabId);
    }
  }

  navigateTab(tabId: string, url: string) {
    const view = this.views.get(tabId);
    if (view) {
      view.webContents.loadURL(url);
    }
  }

  goBack(tabId: string) {
    const view = this.views.get(tabId);
    if (view && view.webContents.canGoBack()) {
      view.webContents.goBack();
    }
  }

  goForward(tabId: string) {
    const view = this.views.get(tabId);
    if (view && view.webContents.canGoForward()) {
      view.webContents.goForward();
    }
  }

  refresh(tabId: string) {
    const view = this.views.get(tabId);
    if (view) {
      view.webContents.reload();
    }
  }
}
