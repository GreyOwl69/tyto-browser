import React, { forwardRef, useImperativeHandle, useEffect, useRef, memo } from 'react';
import './WebView.css';

interface WebViewProps {
  url: string;
  isActive: boolean;
  onLoadStart?: () => void;
  onLoadStop?: () => void;
  onUrlChange?: (url: string) => void;
  onTitleChange?: (title: string) => void;
}

export interface WebViewRef {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

const WebView = memo(forwardRef<WebViewRef, WebViewProps>(({
  url,
  isActive,
  onLoadStart,
  onLoadStop,
  onUrlChange,
  onTitleChange,
}, ref) => {
  const webviewRef = useRef<any>(null);

  useImperativeHandle(ref, () => {
    const methods = {
      goBack: () => {
        console.log('WebView goBack called');
        if (webviewRef.current) {
          webviewRef.current.goBack();
        }
      },
      goForward: () => {
        console.log('WebView goForward called');
        if (webviewRef.current) {
          webviewRef.current.goForward();
        }
      },
      reload: () => {
        console.log('WebView reload called');
        if (webviewRef.current) {
          webviewRef.current.reload();
        }
      },
      canGoBack: () => {
        console.log('WebView canGoBack called');
        return webviewRef.current ? webviewRef.current.canGoBack() : false;
      },
      canGoForward: () => {
        console.log('WebView canGoForward called');
        return webviewRef.current ? webviewRef.current.canGoForward() : false;
      },
    };
    console.log('WebView useImperativeHandle returning methods:', methods);
    return methods;
  }, []);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    const handleLoadStop = () => {
      onLoadStop?.();
      const title = webview.getTitle();
      if (title) {
        onTitleChange?.(title);
      }
    };

    const handleUrlChange = () => {
      const currentUrl = webview.getURL();
      if (currentUrl !== url) {
        onUrlChange?.(currentUrl);
      }
    };

    const handleTitleUpdate = () => {
      const title = webview.getTitle();
      if (title) {
        onTitleChange?.(title);
      }
    };

    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-navigate', handleUrlChange);
    webview.addEventListener('page-title-updated', handleTitleUpdate);

    return () => {
      if (webview) {
        webview.removeEventListener('did-start-loading', handleLoadStart);
        webview.removeEventListener('did-stop-loading', handleLoadStop);
        webview.removeEventListener('did-navigate', handleUrlChange);
        webview.removeEventListener('page-title-updated', handleTitleUpdate);
      }
    };
  }, [url, onLoadStart, onLoadStop, onUrlChange, onTitleChange]);

  return (
    <div 
      className={`webview-container ${isActive ? 'active' : 'inactive'}`}
    >
      <webview
        ref={webviewRef}
        src={url}
        className="webview"
        style={{ 
          width: '100%', 
          height: '100%',
          display: isActive ? 'block' : 'none'
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
