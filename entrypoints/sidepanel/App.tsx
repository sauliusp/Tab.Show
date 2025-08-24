import React, { useState, useEffect, useCallback } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import './App.css';

// Types for better code clarity
interface Tab {
  id: number | undefined;
  title?: string;
  url?: string;
  favIconUrl?: string;
  status?: string;
}

function App() {
  // ===== STATE MANAGEMENT =====
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);

  // ===== INITIALIZATION EFFECT =====
  useEffect(() => {
    const initializeTabsInfo = async () => {
      try {
        // Get the currently active tab
        const [activeTab] = await browser.tabs.query({ 
          active: true, 
          currentWindow: true 
        });
        
        if (activeTab && activeTab.id) {
          setOriginalTab(activeTab as Tab); // Set as the reference tab
        }

        // Get all tabs in the current window
        const windowTabs = await browser.tabs.query({ currentWindow: true });
        setAllTabs(windowTabs as Tab[]);
      } catch (error) {
        console.error('Failed to initialize tabs information:', error);
      }
    };

    initializeTabsInfo();
  }, []); // Run only once on component mount

  // ===== TAB EVENT LISTENERS =====
  useEffect(() => {
    const handleTabRemoved = (tabId: number) => {
      // Remove the deleted tab from our list
      setAllTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
      
      // Reset state if the removed tab was our reference or preview
      if (originalTab?.id === tabId) {
        setOriginalTab(null);
      }
      if (previewTabId === tabId) {
        setPreviewTabId(null);
      }
    };

    const handleTabUpdated = (tabId: number, changeInfo: any, updatedTab: any) => {
      // Only update when the page has finished loading
      if (changeInfo.status === 'complete') {
        setAllTabs(prevTabs => 
          prevTabs.map(tab => 
            tab.id === tabId ? { ...tab, ...updatedTab } : tab
          )
        );
        
        // Also update the originalTab if it's the one being updated
        if (originalTab?.id === tabId) {
          setOriginalTab(prev => prev ? { ...prev, ...updatedTab } : null);
        }
      }
    };

    // Handle new tab creation
    const handleTabCreated = async (tab: any) => {
      try {
        // Only add tabs from the current window
        if (tab.windowId === (await browser.windows.getCurrent()).id) {
          setAllTabs(prevTabs => [...prevTabs, tab as Tab]);
        }
      } catch (error) {
        console.error('Failed to handle tab creation:', error);
      }
    };

    // Handle tab reordering/moving
    const handleTabMoved = async (tabId: number, moveInfo: any) => {
      try {
        // Refresh the entire tab list to get the new order
        const windowTabs = await browser.tabs.query({ currentWindow: true });
        setAllTabs(windowTabs as Tab[]);
      } catch (error) {
        console.error('Failed to handle tab move:', error);
      }
    };

    // Handle tab replacement (e.g., when navigating to a new page)
    const handleTabReplaced = async (addedTabId: number, removedTabId: number) => {
      try {
        // Remove the old tab and add the new one
        setAllTabs(prevTabs => prevTabs.filter(tab => tab.id !== removedTabId));
        
        // Get the new tab info and add it to the list
        const newTab = await browser.tabs.get(addedTabId);
        setAllTabs(prevTabs => [...prevTabs, newTab as Tab]);
        
        // Update references if needed
        if (originalTab?.id === removedTabId) {
          setOriginalTab(newTab as Tab);
        }
        if (previewTabId === removedTabId) {
          setPreviewTabId(addedTabId);
        }
      } catch (error) {
        console.error('Failed to handle tab replacement:', error);
      }
    };

    // Handle window focus changes (tabs might have changed in other windows)
    const handleWindowFocusChanged = async (windowId: number) => {
      try {
        if (windowId === (await browser.windows.getCurrent()).id) {
          // Refresh tab list when our window gains focus
          const windowTabs = await browser.tabs.query({ currentWindow: true });
          setAllTabs(windowTabs as Tab[]);
        }
      } catch (error) {
        console.error('Failed to handle window focus change:', error);
      }
    };

    // Register all event listeners
    browser.tabs.onRemoved.addListener(handleTabRemoved);
    browser.tabs.onUpdated.addListener(handleTabUpdated);
    browser.tabs.onCreated.addListener(handleTabCreated);
    browser.tabs.onMoved.addListener(handleTabMoved);
    browser.tabs.onReplaced.addListener(handleTabReplaced);
    browser.windows.onFocusChanged.addListener(handleWindowFocusChanged);
    
    // Cleanup: remove all listeners when component unmounts
    return () => {
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
      browser.tabs.onCreated.removeListener(handleTabCreated);
      browser.tabs.onMoved.removeListener(handleTabMoved);
      browser.tabs.onReplaced.removeListener(handleTabReplaced);
      browser.windows.onFocusChanged.removeListener(handleWindowFocusChanged);
    };
  }, [originalTab, previewTabId]); // Re-run when these values change

  // ===== TAB INTERACTION HANDLERS =====
  
  // Handle mouse hover over a tab - preview the tab
  const handleTabHover = useCallback(async (tabId: number) => {
    try {
      // Set original tab if not already set (first hover)
      if (!originalTab) {
        const [activeTab] = await browser.tabs.query({ 
          active: true, 
          currentWindow: true 
        });
        if (activeTab && activeTab.id && activeTab.id !== tabId) {
          setOriginalTab(activeTab as Tab);
        }
      }
      
      // Preview the hovered tab if it's different from current preview
      if (previewTabId !== tabId) {
        await browser.tabs.update(tabId, { active: true });
        setPreviewTabId(tabId);
      }
    } catch (error) {
      console.error('Failed to preview tab on hover:', error);
    }
  }, [originalTab, previewTabId]);

  // Handle mouse leave - return to original tab
  const handleTabHoverEnd = useCallback(async () => {
    try {
      if (originalTab && originalTab.id && previewTabId !== originalTab.id) {
        await browser.tabs.update(originalTab.id, { active: true });
        setPreviewTabId(null);
      }
    } catch (error) {
      console.error('Failed to return to original tab:', error);
    }
  }, [originalTab, previewTabId]);

  // Handle tab click - make it the new reference tab
  const handleTabClick = useCallback(async (tabId: number) => {
    try {
      const clickedTab = allTabs.find(tab => tab.id === tabId);
      if (clickedTab) {
        setOriginalTab(clickedTab);
        setPreviewTabId(null);
      }
    } catch (error) {
      console.error('Failed to handle tab click:', error);
    }
  }, [allTabs]);

  // ===== RENDER HELPERS =====
  
  // Render the active tab header
  const renderActiveTabHeader = () => {
    if (!originalTab) return null;

    return (
      <div className="active-tab-header">
        <div className="active-tab-content">
          <div className="active-tab-avatar">
            <Avatar
              alt="Active Tab"
              src={originalTab.favIconUrl || undefined}
              sx={{ width: 32, height: 32, position: 'relative' }}
            >
              {!originalTab.favIconUrl && 
               (originalTab.title ? originalTab.title.charAt(0).toUpperCase() : 'A')}
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
    );
  };

  // Render a single tab item
  const renderTabItem = (tab: Tab) => {
    if (!tab.id) return null; // Skip tabs without ID
    
    const labelId = `checkbox-list-secondary-label-${tab.id}`;
    const isPreviewTab = previewTabId === tab.id;
    const isOriginalTab = originalTab?.id === tab.id;
    const isLoading = tab.status === 'loading';

    return (
      <ListItem
        key={tab.id}
        onMouseEnter={() => handleTabHover(tab.id!)}
        onMouseLeave={handleTabHoverEnd}
        onClick={() => handleTabClick(tab.id!)}
        sx={{
          backgroundColor: isPreviewTab 
            ? 'rgba(102, 126, 234, 0.15)' 
            : isOriginalTab 
            ? 'rgba(76, 175, 80, 0.1)' 
            : 'transparent',
          borderLeft: isPreviewTab 
            ? '3px solid #667eea' 
            : isOriginalTab 
            ? '3px solid #4caf50' 
            : '3px solid transparent',
          transition: 'all 0.2s ease',
          opacity: isLoading ? 0.7 : 1,
          '&:hover': {
            backgroundColor: isPreviewTab 
              ? 'rgba(102, 126, 234, 0.2)' 
              : isOriginalTab 
              ? 'rgba(76, 175, 80, 0.15)' 
              : 'rgba(0, 0, 0, 0.04)'
          }
        }}
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
                position: 'relative',
                border: isOriginalTab ? '2px solid #4caf50' : 'none'
              }}
            >
              {!tab.favIconUrl && 
               (tab.title ? tab.title.charAt(0).toUpperCase() : 'T')}
              
              {/* Loading indicator */}
              {isLoading && (
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

              {/* Original tab indicator */}
              {isOriginalTab && (
                <div style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            id={labelId} 
            primary={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontWeight: isOriginalTab ? '600' : 'normal',
                  color: isOriginalTab ? '#2e7d32' : 'inherit'
                }}>
                  {tab.title || 'Untitled Tab'}
                </span>
                {isLoading && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#667eea',
                    fontStyle: 'italic'
                  }}>
                    Loading...
                  </span>
                )}
                {isOriginalTab && (
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '500'
                  }}>
                    Original
                  </span>
                )}
                {isPreviewTab && (
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '500'
                  }}>
                    Preview
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
  };

  // ===== MAIN RENDER =====
  return (
    <div className="sidepanel">
      {/* Active Tab Header */}
      {renderActiveTabHeader()}

      {/* Tabs List */}
      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {allTabs.map(renderTabItem)}
      </List>
    </div>
  );
}

export default App;
