import React, { useState, useEffect, useCallback } from 'react';
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
  const [originalTab, setOriginalTab] = useState<any>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);

  useEffect(() => {
    // Get current tab information and all tabs when sidepanel opens
    const getTabsInfo = async () => {
      try {
        // Get current active tab
        const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
          setCurrentTab(activeTab);
          setCurrentUrl(activeTab.url || '');
          // Set the original tab to the currently active tab
          setOriginalTab(activeTab);
        }

        // Get all tabs in current window
        const allTabs = await browser.tabs.query({ currentWindow: true });
        setTabs(allTabs);
      } catch (error) {
        console.error('Error getting tabs info:', error);
      }
    };

    getTabsInfo();
  }, []); // Only run once on mount

  // Separate effect for tab event listeners
  useEffect(() => {
    const handleTabRemoved = (tabId: number) => {
      setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
      
      // If the removed tab was our original or preview tab, reset state
      setOriginalTab((prevOriginal: any) => tabId === prevOriginal?.id ? null : prevOriginal);
      setPreviewTabId(prevPreview => tabId === prevPreview ? null : prevPreview);
    };

    const handleTabUpdated = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === 'complete') {
        setTabs(prevTabs => 
          prevTabs.map(t => t.id === tabId ? { ...t, ...tab } : t)
        );
      }
    };

    // Add listeners
    browser.tabs.onRemoved.addListener(handleTabRemoved);
    browser.tabs.onUpdated.addListener(handleTabUpdated);
    
    // Cleanup function to remove listeners
    return () => {
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, []); // Only run once on mount

  const handleTabHover = useCallback(async (tabId: number) => {
    try {
      console.log('Hover triggered for tab:', tabId, 'Current state:', { originalTab, previewTabId });
      
      // Only set original tab if we haven't set it yet
      if (originalTab === null) {
        const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (activeTab.id && activeTab.id !== tabId) {
          console.log('Setting original tab to:', activeTab);
          setOriginalTab(activeTab);
        }
      }
      
      // Only preview if this tab is different from current preview
      if (previewTabId !== tabId) {
        console.log('Activating preview tab:', tabId);
        await browser.tabs.update(tabId, { active: true });
        setPreviewTabId(tabId);
      } else {
        console.log('Tab already previewed, skipping activation');
      }
    } catch (error) {
      console.error('Error previewing tab:', error);
    }
  }, [originalTab, previewTabId]);

  const handleTabHoverEnd = useCallback(async () => {
    try {
      if (originalTab && previewTabId !== originalTab.id) {
        // Return to original tab
        await browser.tabs.update(originalTab.id, { active: true });
        setPreviewTabId(null);
      }
    } catch (error) {
      console.error('Error returning to original tab:', error);
    }
  }, [originalTab, previewTabId]);

  const handleTabClick = useCallback(async (tabId: number) => {
    try {
      // User clicked - this becomes the new "original" tab
      const clickedTab = tabs.find(t => t.id === tabId);
      if (clickedTab) {
        setOriginalTab(clickedTab);
        setPreviewTabId(null);
      }
      // Tab is already active from hover, no need to update
    } catch (error) {
      console.error('Error switching to tab:', error);
    }
  }, [tabs]);

  return (
    <div className="sidepanel">
      {/* Sticky Active Tab Header */}
      {originalTab && (
        <div className="active-tab-header">
          <div className="active-tab-content">
            <div className="active-tab-avatar">
              <Avatar
                alt="Active Tab"
                src={originalTab.favIconUrl || undefined}
                sx={{ 
                  width: 32, 
                  height: 32,
                  position: 'relative'
                }}
              >
                {!originalTab.favIconUrl && 
                 (originalTab.title ? 
                  originalTab.title.charAt(0).toUpperCase() : 'A')}
              </Avatar>
            </div>
            <div className="active-tab-info">
              <div className="active-tab-title">
                {originalTab.title || 'Active Tab'}
              </div>
              <div className="active-tab-url">
                {originalTab.url || ''}
              </div>
            </div>
            <div className="active-tab-status">
              <span className="status-dot active"></span>
              <span className="status-text">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs List */}
      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {tabs.map((tab) => {
              const labelId = `checkbox-list-secondary-label-${tab.id}`;
              return (
                <ListItem
                  key={tab.id}
                  onMouseEnter={() => handleTabHover(tab.id)}
                  onMouseLeave={handleTabHoverEnd}
                  onClick={() => handleTabClick(tab.id)}
                  sx={{
                    backgroundColor: previewTabId === tab.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    borderLeft: previewTabId === tab.id ? '3px solid #667eea' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    opacity: tab.status === 'loading' ? 0.7 : 1
                  }}
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
                        sx={{ 
                          width: 24, 
                          height: 24,
                          position: 'relative'
                        }}
                      >
                        {!tab.favIconUrl && (tab.title ? tab.title.charAt(0).toUpperCase() : 'T')}
                        {tab.status === 'loading' && (
                          <div style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#667eea',
                            animation: 'pulse 1.5s infinite'
                          }} />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      id={labelId} 
                      primary={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {tab.title || 'Untitled Tab'}
                          {tab.status === 'loading' && (
                            <span style={{ 
                              fontSize: '0.75rem', 
                              color: '#667eea',
                              fontStyle: 'italic'
                            }}>
                              Loading...
                            </span>
                          )}
                        </div>
                      }
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
    </div>
  );
}

export default App;
