import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
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
  lastAccessed?: number; // Timestamp of last access
}

function App() {
  const theme = useTheme();
  
  // ===== STATE MANAGEMENT =====
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const [originalTabIndex, setOriginalTabIndex] = useState<number>(-1);

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
        
        // Find the index of the original tab
        if (activeTab && activeTab.id) {
          const index = windowTabs.findIndex(tab => tab.id === activeTab.id);
          setOriginalTabIndex(index);
        }
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
      // Update tab status for all status changes (loading, complete, unloaded)
      if (changeInfo.status) {
        setAllTabs(prevTabs => 
          prevTabs.map(tab => 
            tab.id === tabId ? { ...tab, ...updatedTab } : tab
          )
        );
        
        // Also update the originalTab if it's the one being updated
        if (originalTab?.id === tabId) {
          setOriginalTab(prev => prev ? { ...prev, ...updatedTab } : null);
        }
        
        // Update original tab index if needed
        if (originalTab?.id === tabId) {
          const newIndex = allTabs.findIndex(tab => tab.id === tabId);
          if (newIndex !== -1) {
            setOriginalTabIndex(newIndex);
          }
        }
      }
    };

    // Handle new tab creation - refresh entire list to maintain order
    const handleTabCreated = async (tab: any) => {
      try {
        // Only handle tabs from the current window
        if (tab.windowId === (await browser.windows.getCurrent()).id) {
          // Instead of just adding the new tab, refresh the entire list to maintain order
          const windowTabs = await browser.tabs.query({ currentWindow: true });
          setAllTabs(windowTabs as Tab[]);
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
        // Refresh the entire tab list to maintain order
        const windowTabs = await browser.tabs.query({ currentWindow: true });
        setAllTabs(windowTabs as Tab[]);
        
        // Update references if needed
        if (originalTab?.id === removedTabId) {
          const newTab = windowTabs.find(tab => tab.id === addedTabId);
          if (newTab) {
            setOriginalTab(newTab as Tab);
          }
        }
        if (previewTabId === removedTabId) {
          setPreviewTabId(addedTabId);
        }
      } catch (error) {
        console.error('Failed to handle tab replacement:', error);
      }
    };

    // Handle tab activation (when switching tabs via keyboard/mouse)
    const handleTabActivated = async (activeInfo: any) => {
      try {
        // Only handle activations in the current window
        if (activeInfo.windowId === (await browser.windows.getCurrent()).id) {
          const activatedTabId = activeInfo.tabId;
          
          // If this is a different tab than our current preview, update the preview
          if (previewTabId !== activatedTabId) {
            setPreviewTabId(activatedTabId);
          }
          
          // If we don't have an original tab set yet, set this as the original
          if (!originalTab) {
            const activatedTab = await browser.tabs.get(activatedTabId);
            setOriginalTab(activatedTab as Tab);
          }
        }
      } catch (error) {
        console.error('Failed to handle tab activation:', error);
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
    browser.tabs.onActivated.addListener(handleTabActivated);
    browser.windows.onFocusChanged.addListener(handleWindowFocusChanged);
    
    // Cleanup: remove all listeners when component unmounts
    return () => {
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
      browser.tabs.onCreated.removeListener(handleTabCreated);
      browser.tabs.onMoved.removeListener(handleTabMoved);
      browser.tabs.onReplaced.removeListener(handleTabReplaced);
      browser.tabs.onActivated.removeListener(handleTabActivated);
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
        // Don't immediately clear the preview - let it stay visible
        // This prevents badge flickering and provides stable visual feedback
        // The preview will only be cleared when a new tab is hovered or clicked
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

  // ===== VISUAL STATE HELPER =====
  
  const getTabVisualState = (tab: Tab) => {
    const isPreviewTab = previewTabId === tab.id;
    const isOriginalTab = originalTab?.id === tab.id;
    const isLoading = tab.status === 'loading';
    const hasErrors = tab.status === 'unloaded' || tab.status === 'error';
    
    // Determine if tab is stale (inactive for more than 7 days)
    const isStale = tab.lastAccessed && (Date.now() - tab.lastAccessed) > 7 * 24 * 60 * 60 * 1000;
    
    const visualState = {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      avatarOverlays: [] as Array<{type: string, color: string, position: string}>,
      textColor: theme.palette.text.primary,
      opacity: 1,
      avatarFilter: 'none'
    };
    
    // Apply state logic in priority order
    
    // 1. Original tab (highest priority)
    if (isOriginalTab) {
      visualState.borderColor = theme.palette.custom.original;
      visualState.backgroundColor = theme.palette.custom.original + '40'; // Increased from '15' to '40'
      visualState.avatarOverlays.push({
        type: 'checkmark',
        color: theme.palette.custom.original,
        position: 'bottom-right'
      });
    }
    
    // 2. Preview tab
    if (isPreviewTab) {
      visualState.borderColor = theme.palette.custom.preview;
      visualState.backgroundColor = theme.palette.custom.preview + '40'; // Increased from '15' to '40'
      if (!isOriginalTab) {
        visualState.avatarOverlays.push({
          type: 'preview',
          color: theme.palette.custom.preview,
          position: 'top-right'
        });
      }
    }
    
    // 3. Loading state
    if (isLoading) {
      visualState.avatarOverlays.push({
        type: 'loading',
        color: theme.palette.custom.loading,
        position: 'top-right'
      });
    }
    
    // 4. Error state
    if (hasErrors) {
      visualState.borderColor = theme.palette.error.main;
      visualState.backgroundColor = theme.palette.error.main + '30'; // Increased from '15' to '30'
      visualState.textColor = theme.palette.error.main;
      visualState.avatarOverlays.push({
        type: 'error',
        color: theme.palette.error.main,
        position: 'top-left'
      });
    }
    
    // 5. Stale state
    if (isStale) {
      if (!visualState.borderColor || visualState.borderColor === 'transparent') {
        visualState.borderColor = theme.palette.warning.main;
      }
      if (!visualState.backgroundColor || visualState.backgroundColor === 'transparent') {
        visualState.backgroundColor = theme.palette.warning.main + '30'; // Increased from '15' to '30'
      }
      visualState.opacity = 0.6;
      visualState.avatarFilter = 'grayscale(0.3) saturate(0.7)';
      visualState.avatarOverlays.push({
        type: 'stale',
        color: theme.palette.warning.main,
        position: 'bottom-left'
      });
    }
    
    // 6. Combined states - adjust background for multiple states
    if (isOriginalTab && isPreviewTab) {
      visualState.backgroundColor = theme.palette.secondary.main + '90'; // Increased opacity for combined state
      visualState.textColor = 'white';
    }
    
    return visualState;
  };

  // ===== RENDER HELPERS =====

  // Render avatar overlay based on type and position
  const renderAvatarOverlay = (overlay: {type: string, color: string, position: string}) => {
    const positionStyles = {
      'top-left': { top: -2, left: -2 },
      'top-right': { top: -2, right: -2 },
      'bottom-left': { bottom: -2, left: -2 },
      'bottom-right': { bottom: -2, right: -2 }
    };
    
    const size = overlay.type === 'checkmark' ? 12 : 8;
    
    switch (overlay.type) {
      case 'checkmark':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
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
        );
        
      case 'loading':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            animation: 'pulse 1.5s infinite'
          }} />
        );
        
      case 'error':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            border: '1px solid white'
          }} />
        );
        
      case 'stale':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            border: '1px solid white'
          }} />
        );
        
      case 'preview':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            border: '1px solid white'
          }} />
        );
        
      default:
        return null;
    }
  };

  // Render a single tab item
  const renderTabItem = (tab: Tab) => {
    if (!tab.id) return null; // Skip tabs without ID
    
    const visualState = getTabVisualState(tab);
    
    return (
      <ListItem
        key={tab.id}
        onMouseEnter={() => handleTabHover(tab.id!)}
        onMouseLeave={handleTabHoverEnd}
        onClick={() => handleTabClick(tab.id!)}
        sx={{
          borderLeft: `3px solid ${visualState.borderColor}`,
          backgroundColor: visualState.backgroundColor,
          opacity: visualState.opacity,
          transition: 'all 0.2s ease',
          
          // Add subtle pattern overlay for stale tabs
          backgroundImage: visualState.opacity < 1 ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)' : 'none',
          
          '&:hover': {
            backgroundColor: visualState.backgroundColor === 'transparent' 
              ? theme.palette.action.hover
              : visualState.backgroundColor === theme.palette.secondary.main
              ? theme.palette.secondary.main
              : visualState.backgroundColor + '80' // Increased from 'dd' to '80' for more prominent hover
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
                border: originalTab?.id === tab.id ? `2px solid ${theme.palette.custom.original}` : 'none',
                filter: visualState.avatarFilter
              }}
            >
              {!tab.favIconUrl && 
               (tab.title ? tab.title.charAt(0).toUpperCase() : 'T')}
              
              {/* Render all avatar overlays */}
              {visualState.avatarOverlays.map((overlay, index) => (
                <React.Fragment key={`${overlay.type}-${index}`}>
                  {renderAvatarOverlay(overlay)}
                </React.Fragment>
              ))}
            </Avatar>
          </ListItemAvatar>
          
          <ListItemText 
            primary={
              <span style={{
                fontWeight: 'normal',
                color: visualState.textColor,
                fontSize: '0.875rem'
              }}>
                {tab.title || 'Untitled Tab'}
              </span>
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
      {/* Fixed Header - Always visible original tab */}
      {originalTab && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `2px solid ${theme.palette.custom.original}`,
          padding: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar
              alt={originalTab.title || 'Original Tab'}
              src={originalTab.favIconUrl || undefined}
              sx={{ 
                width: 32, 
                height: 32,
                border: `2px solid ${theme.palette.custom.original}`
              }}
            >
              {!originalTab.favIconUrl && 
               (originalTab.title ? originalTab.title.charAt(0).toUpperCase() : 'T')}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '0.9rem',
                color: theme.palette.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {originalTab.title || 'Untitled Tab'}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: theme.palette.text.secondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {originalTab.url || 'No URL'}
              </div>
            </div>
            <div style={{
              fontSize: '0.7rem',
              backgroundColor: theme.palette.custom.original,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}>
              Original
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Tabs List */}
      <List dense sx={{ 
        width: '100%', 
        bgcolor: 'background.paper',
        flex: 1, // Take up remaining space
        overflow: 'auto',
        paddingBottom: 0, // Remove any bottom padding
        marginBottom: 0, // Remove any bottom margin
        minHeight: 0 // Allow flex shrinking
      }}>
        {allTabs.map(renderTabItem)}
      </List>
    </div>
  );
}

export default App;
