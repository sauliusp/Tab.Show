import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [originalTabId, setOriginalTabId] = useState<number | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // Set up tab event listeners
    const handleTabRemoved = (tabId: number) => {
      setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
      
      // If the removed tab was our original or preview tab, reset state
      if (tabId === originalTabId) {
        setOriginalTabId(null);
      }
      if (tabId === previewTabId) {
        setPreviewTabId(null);
      }
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
    
    // Cleanup function to clear timeouts and remove listeners
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, [originalTabId, previewTabId]);

  const handleTabHover = useCallback(async (tabId: number) => {
    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set new timeout for hover
    hoverTimeoutRef.current = setTimeout(async () => {
      try {
        if (originalTabId === null) {
          // First hover - store original tab
          const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
          if (activeTab.id) {
            setOriginalTabId(activeTab.id);
          }
        }
        
        // Activate preview tab
        await browser.tabs.update(tabId, { active: true });
        setPreviewTabId(tabId);
      } catch (error) {
        console.error('Error previewing tab:', error);
      }
    }, 150); // 150ms delay
  }, [originalTabId]);

  const handleTabHoverEnd = useCallback(async () => {
    try {
      if (originalTabId && previewTabId !== originalTabId) {
        // Return to original tab
        await browser.tabs.update(originalTabId, { active: true });
        setPreviewTabId(null);
      }
    } catch (error) {
      console.error('Error returning to original tab:', error);
    }
  }, [originalTabId, previewTabId]);

  const handleTabClick = useCallback(async (tabId: number) => {
    try {
      // User clicked - this becomes the new "original" tab
      setOriginalTabId(tabId);
      setPreviewTabId(null);
      // Tab is already active from hover, no need to update
    } catch (error) {
      console.error('Error switching to tab:', error);
    }
  }, []);

  return (
    <div className="sidepanel">
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
