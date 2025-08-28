import React, { useState, useEffect } from 'react';
import './NavigationBar.css';

interface NavigationBarProps {
  currentUrl: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentUrl,
  isLoading,
  canGoBack,
  canGoForward,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = urlInput.trim();
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it looks like a domain
      if (url.includes('.') && !url.includes(' ')) {
        url = `https://${url}`;
      } else {
        // Treat as search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    onNavigate(url);
  };

  return (
    <div className="navigation-bar">
      <div className="nav-buttons">
        <button 
          className={`nav-btn ${!canGoBack ? 'disabled' : ''}`}
          onClick={onGoBack}
          disabled={!canGoBack}
          title="Go Back"
        >
          ←
        </button>
        <button 
          className={`nav-btn ${!canGoForward ? 'disabled' : ''}`}
          onClick={onGoForward}
          disabled={!canGoForward}
          title="Go Forward"
        >
          →
        </button>
        <button 
          className="nav-btn"
          onClick={onRefresh}
          title="Refresh"
        >
          {isLoading ? '⏹' : '↻'}
        </button>
      </div>
      
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="url-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL or search..."
          autoComplete="off"
        />
      </form>
      
      <div className="browser-menu">
        <button className="menu-btn" title="Menu">
          ⋮
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
