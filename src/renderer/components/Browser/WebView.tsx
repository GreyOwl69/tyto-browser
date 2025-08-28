import React, { forwardRef, useImperativeHandle, useEffect, useRef, memo } from 'react';
import './WebView.css';

interface WebViewProps {
  url: string;
  onLoadStart?: () => void;
  onLoadStop?: () => void;
  onUpdateCanGoBack?: (canGoBack: boolean) => void;
  onUpdateCanGoForward?: (canGoForward: boolean) => void;
  onUrlChange?: (url: string) => void;
}

interface WebViewRef {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
}

const WebView = memo(forwardRef<WebViewRef, WebViewProps>(({
  url,
  onLoadStart,
  onLoadStop,
  onUpdateCanGoBack,
  onUpdateCanGoForward,
  onUrlChange,
}, ref) => {
  const webviewRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    goBack: () => {
      if (webviewRef.current) {
        webviewRef.current.goBack();
      }
    },
    goForward: () => {
      if (webviewRef.current) {
        webviewRef.current.goForward();
      }
    },
    reload: () => {
      if (webviewRef.current) {
        webviewRef.current.reload();
      }
    },
  }));

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    const handleLoadStop = () => {
      onLoadStop?.();
      if (webview) {
        onUpdateCanGoBack?.(webview.canGoBack());
        onUpdateCanGoForward?.(webview.canGoForward());
      }
    };

    const handleUrlChange = () => {
      if (webview) {
        const currentUrl = webview.getURL();
        if (currentUrl !== url) {
          onUrlChange?.(currentUrl);
        }
      }
    };

    // Add event listeners
    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-navigate', handleUrlChange);

    return () => {
      if (webview) {
        webview.removeEventListener('did-start-loading', handleLoadStart);
        webview.removeEventListener('did-stop-loading', handleLoadStop);
        webview.removeEventListener('did-navigate', handleUrlChange);
      }
    };
  }, [url]); // Only depend on URL changes

  return (
  <div className="webview-container">
    <webview
      ref={webviewRef}
      src={url}
      className="webview"
      key={url}
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '100%',
        minWidth: '100%'
      }}
      allowpopups="true"
      webpreferences="contextIsolation=false,nodeIntegration=false,webSecurity=false,enableRemoteModule=false"
      useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      partition="persist:main"
    />
  </div>
);


}));

WebView.displayName = 'WebView';

export default WebView;
