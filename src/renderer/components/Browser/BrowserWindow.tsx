import React, { useState, useRef, useCallback } from 'react';
import NavigationBar from './NavigationBar';
import WebView from './WebView';
import './BrowserWindow.css';

const BrowserWindow: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webViewRef = useRef<any>(null);

  const handleNavigate = useCallback((url: string) => {
    if (url !== currentUrl) {
      setCurrentUrl(url);
      setIsLoading(true);
    }
  }, [currentUrl]);

  const handleGoBack = useCallback(() => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  }, [canGoBack]);

  const handleGoForward = useCallback(() => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  }, [canGoForward]);

  const handleRefresh = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleLoadStop = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleUrlChange = useCallback((url: string) => {
    if (url !== currentUrl) {
      setCurrentUrl(url);
    }
  }, [currentUrl]);

  return (
    <div className="browser-window">
      <NavigationBar
        currentUrl={currentUrl}
        isLoading={isLoading}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onNavigate={handleNavigate}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onRefresh={handleRefresh}
      />
      <WebView
        ref={webViewRef}
        url={currentUrl}
        onLoadStart={handleLoadStart}
        onLoadStop={handleLoadStop}
        onUpdateCanGoBack={setCanGoBack}
        onUpdateCanGoForward={setCanGoForward}
        onUrlChange={handleUrlChange}
      />
    </div>
  );
};

export default BrowserWindow;
