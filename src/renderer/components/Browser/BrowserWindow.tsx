import React, { useState, useRef, useCallback } from 'react';
import TabBar, { Tab } from './TabBar';
import NavigationBar from './NavigationBar';
import './BrowserWindow.css';

const BrowserWindow: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'Google',
      url: 'https://www.google.com',
      isLoading: false,
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webviewRefs = useRef<{ [key: string]: any }>({});

  const generateTabId = () => Date.now().toString();

  const updateNavigationState = useCallback(() => {
    const webview = webviewRefs.current[activeTabId];
    if (webview) {
      setCanGoBack(webview.canGoBack ? webview.canGoBack() : false);
      setCanGoForward(webview.canGoForward ? webview.canGoForward() : false);
    }
  }, [activeTabId]);

  const handleNewTab = useCallback(() => {
    const newTabId = generateTabId();
    const newTab: Tab = {
      id: newTabId,
      title: 'New Tab',
      url: 'https://www.google.com',
      isLoading: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  }, []);

  const handleTabSelect = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setTimeout(() => {
      updateNavigationState();
    }, 100);
  }, [updateNavigationState]);

  const handleTabClose = useCallback((tabId: string) => {
    if (tabs.length === 1) return;

    setTabs(prev => {
      const updatedTabs = prev.filter(tab => tab.id !== tabId);
      
      if (tabId === activeTabId && updatedTabs.length > 0) {
        const currentIndex = prev.findIndex(tab => tab.id === tabId);
        const nextTab = updatedTabs[currentIndex] || updatedTabs[currentIndex - 1] || updatedTabs[0];
        setActiveTabId(nextTab.id);
      }
      
      delete webviewRefs.current[tabId];
      return updatedTabs;
    });
  }, [activeTabId, tabs.length]);

  const handleNavigate = useCallback((url: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url, isLoading: true }
        : tab
    ));
  }, [activeTabId]);

  const handleGoBack = useCallback(() => {
    const webview = webviewRefs.current[activeTabId];
    if (webview && webview.canGoBack && webview.canGoBack()) {
      webview.goBack();
      setTimeout(updateNavigationState, 500);
    }
  }, [activeTabId, updateNavigationState]);

  const handleGoForward = useCallback(() => {
    const webview = webviewRefs.current[activeTabId];
    if (webview && webview.canGoForward && webview.canGoForward()) {
      webview.goForward();
      setTimeout(updateNavigationState, 500);
    }
  }, [activeTabId, updateNavigationState]);

  const handleRefresh = useCallback(() => {
    const webview = webviewRefs.current[activeTabId];
    if (webview && webview.reload) {
      webview.reload();
    }
  }, [activeTabId]);

  const handleLoadStart = useCallback((tabId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, isLoading: true }
        : tab
    ));
  }, []);

  const handleLoadStop = useCallback((tabId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, isLoading: false }
        : tab
    ));
    if (tabId === activeTabId) {
      setTimeout(updateNavigationState, 100);
    }
  }, [activeTabId, updateNavigationState]);

  const handleUrlChange = useCallback((tabId: string, url: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, url }
        : tab
    ));
  }, []);

  const handleTitleChange = useCallback((tabId: string, title: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, title: title || 'New Tab' }
        : tab
    ));
  }, []);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="browser-window">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      
      <NavigationBar
        currentUrl={activeTab?.url || ''}
        isLoading={activeTab?.isLoading || false}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onNavigate={handleNavigate}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onRefresh={handleRefresh}
      />
      
      <div className="webviews-container">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`webview-wrapper ${tab.id === activeTabId ? 'active' : 'inactive'}`}
          >
            <webview
              ref={(ref) => {
                if (ref) {
                  webviewRefs.current[tab.id] = ref;
                  
                  ref.addEventListener('did-start-loading', () => {
                    handleLoadStart(tab.id);
                  });
                  
                  ref.addEventListener('did-stop-loading', () => {
                    handleLoadStop(tab.id);
                    const title = ref.getTitle();
                    if (title) {
                      handleTitleChange(tab.id, title);
                    }
                  });
                  
                  ref.addEventListener('did-navigate', () => {
                    const currentUrl = ref.getURL();
                    if (currentUrl) {
                      handleUrlChange(tab.id, currentUrl);
                    }
                    updateNavigationState();
                  });
                }
              }}
              src={tab.url}
              style={{ width: '100%', height: '100%' }}
              allowpopups="true"
              webpreferences="webSecurity=false"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserWindow;
