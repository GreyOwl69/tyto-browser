import React from 'react';
import './TabBar.css';

export interface Tab {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
  favicon?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
}) => {
  const handleTabClick = (tabId: string) => {
    onTabSelect(tabId);
  };

  const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div className="tab-bar">
      <button className="new-tab-button" onClick={onNewTab} title="New tab">
        +
      </button>
      
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <div className="tab-content">
              {tab.isLoading && (
                <div className="tab-loading-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
              {tab.favicon && !tab.isLoading && (
                <img
                  src={tab.favicon}
                  alt=""
                  className="tab-favicon"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="tab-title" title={tab.title}>
                {tab.title || 'New Tab'}
              </span>
            </div>
            {tabs.length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => handleCloseClick(e, tab.id)}
                title="Close tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
