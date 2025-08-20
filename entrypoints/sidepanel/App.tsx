import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import './App.css';

function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<any>(null);
  const [tabs, setTabs] = useState<any[]>([]);

  useEffect(() => {
    // Get current tab information and all tabs when sidepanel opens
    const getTabsInfo = async () => {
      try {
        // Get current active tab
        const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
          setCurrentTab(activeTab);
          setCurrentUrl(activeTab.url || '');
        }

        // Get all tabs in current window
        const allTabs = await browser.tabs.query({ currentWindow: true });
        setTabs(allTabs);
      } catch (error) {
        console.error('Error getting tabs info:', error);
      }
    };

    getTabsInfo();
  }, []);

  return (
    <div className="sidepanel">
      <header className="header">
        <h1>Narsheek</h1>
        <div className="status-indicator">
          <span className="status-dot active"></span>
          <span className="status-text">Active</span>
        </div>
      </header>
      
      <main className="content">
        <section className="current-page">
          <h2>Current Page</h2>
          <div className="url-display">
            <span className="url-text">{currentUrl || 'Loading...'}</span>
          </div>
        </section>

        <section className="tabs-list">
          <h2>Open Tabs</h2>
          <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {tabs.map((tab) => {
              const labelId = `checkbox-list-secondary-label-${tab.id}`;
              return (
                <ListItem
                  key={tab.id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        alt={tab.title || 'Tab'}
                        src={tab.favIconUrl || undefined}
                        sx={{ width: 24, height: 24 }}
                      >
                        {!tab.favIconUrl && (tab.title ? tab.title.charAt(0).toUpperCase() : 'T')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      id={labelId} 
                      primary={tab.title || 'Untitled Tab'} 
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: { fontSize: '0.875rem' }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </section>

        <section className="actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">
              Analyze Page
            </button>
            <button className="action-btn secondary">
              Save Note
            </button>
            <button className="action-btn secondary">
              View History
            </button>
          </div>
        </section>

        <section className="info">
          <h2>Extension Info</h2>
          <div className="info-item">
            <span className="label">Version:</span>
            <span className="value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value">Running</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
