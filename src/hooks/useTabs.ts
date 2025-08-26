import { useState, useEffect, useCallback } from 'react';
import { Tab } from '../types/Tab';
import { tabService } from '../services/TabService';

export function useTabs() {
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [tabGroups, setTabGroups] = useState<any[]>([]);
  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const [originalTabIndex, setOriginalTabIndex] = useState<number>(-1);

  // Tab group event handlers
  const handleTabGroupUpdated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupUpdated - fetched groups:', groups);
      setTabGroups(groups);
    } catch (error) {
      console.error('Failed to update tab groups:', error);
    }
  }, []);

  const handleTabGroupCreated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupCreated - fetched groups:', groups);
      setTabGroups(groups);
    } catch (error) {
      console.error('Failed to update tab groups after creation:', error);
    }
  }, []);

  const handleTabGroupRemoved = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupRemoved - fetched groups:', groups);
      setTabGroups(groups);
    } catch (error) {
      console.error('Failed to update tab groups after removal:', error);
    }
  }, []);

  // Initialize tabs information
  const initializeTabsInfo = useCallback(async () => {
    try {
      const [activeTab, windowTabs, groups] = await Promise.all([
        tabService.getActiveTab(),
        tabService.getAllTabs(),
        tabService.getTabGroups()
      ]);
      
      console.log('initializeTabsInfo - fetched data:', {
        activeTab: activeTab?.id,
        windowTabsCount: windowTabs.length,
        groupsCount: groups.length,
        groups: groups,
        windowTabs: windowTabs.map(t => ({ id: t.id, title: t.title, groupId: t.groupId }))
      });
      
      if (activeTab && activeTab.id) {
        setOriginalTab(activeTab);
        const index = windowTabs.findIndex(tab => tab.id === activeTab.id);
        setOriginalTabIndex(index);
      }
      
      setAllTabs(windowTabs);
      setTabGroups(groups);
    } catch (error) {
      console.error('Failed to initialize tabs information:', error);
    }
  }, []);

  // Tab event handlers
  const handleTabRemoved = useCallback((tabId: number) => {
    setAllTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
    
    if (originalTab?.id === tabId) {
      setOriginalTab(null);
    }
    if (previewTabId === tabId) {
      setPreviewTabId(null);
    }
  }, [originalTab, previewTabId]);

  const handleTabUpdated = useCallback((tabId: number, changeInfo: any, updatedTab: any) => {
    if (changeInfo.status || changeInfo.groupId) {
      setAllTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === tabId ? { ...tab, ...updatedTab } : tab
        )
      );
      
      if (originalTab?.id === tabId) {
        setOriginalTab(prev => prev ? { ...prev, ...updatedTab } : null);
      }
      
      if (originalTab?.id === tabId) {
        const newIndex = allTabs.findIndex(tab => tab.id === tabId);
        if (newIndex !== -1) {
          setOriginalTabIndex(newIndex);
        }
      }

      // If groupId changed, refresh tab groups
      if (changeInfo.groupId) {
        handleTabGroupUpdated();
      }
    }
  }, [originalTab, allTabs, handleTabGroupUpdated]);

  const handleTabCreated = useCallback(async (tab: any) => {
    try {
      const currentWindowId = await tabService.getCurrentWindowId();
      if (tab.windowId === currentWindowId) {
        const [windowTabs, groups] = await Promise.all([
          tabService.getAllTabs(),
          tabService.getTabGroups()
        ]);
        setAllTabs(windowTabs);
        setTabGroups(groups);
      }
    } catch (error) {
      console.error('Failed to handle tab creation:', error);
    }
  }, []);

  const handleTabMoved = useCallback(async () => {
    try {
      const [windowTabs, groups] = await Promise.all([
        tabService.getAllTabs(),
        tabService.getTabGroups()
      ]);
      setAllTabs(windowTabs);
      setTabGroups(groups);
    } catch (error) {
      console.error('Failed to handle tab move:', error);
    }
  }, []);

  const handleTabReplaced = useCallback(async (addedTabId: number, removedTabId: number) => {
    try {
      const windowTabs = await tabService.getAllTabs();
      setAllTabs(windowTabs);
      
      if (originalTab?.id === removedTabId) {
        const newTab = windowTabs.find(tab => tab.id === addedTabId);
        if (newTab) {
          setOriginalTab(newTab);
        }
      }
      if (previewTabId === removedTabId) {
        setPreviewTabId(addedTabId);
      }
    } catch (error) {
      console.error('Failed to handle tab replacement:', error);
    }
  }, [originalTab, previewTabId]);

  const handleTabActivated = useCallback(async (activeInfo: any) => {
    try {
      const currentWindowId = await tabService.getCurrentWindowId();
      if (activeInfo.windowId === currentWindowId) {
        const activatedTabId = activeInfo.tabId;
        
        if (previewTabId !== activatedTabId) {
          setPreviewTabId(activatedTabId);
        }
        
        if (!originalTab) {
          const activatedTab = await tabService.getTabById(activatedTabId);
          if (activatedTab) {
            setOriginalTab(activatedTab);
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle tab activation:', error);
    }
  }, [originalTab, previewTabId]);

  const handleWindowFocusChanged = useCallback(async (windowId: number) => {
    try {
      const currentWindowId = await tabService.getCurrentWindowId();
      if (windowId === currentWindowId) {
        const [windowTabs, groups] = await Promise.all([
          tabService.getAllTabs(),
          tabService.getTabGroups()
        ]);
        setAllTabs(windowTabs);
        setTabGroups(groups);
      }
    } catch (error) {
      console.error('Failed to handle window focus change:', error);
    }
  }, []);

  // Tab interaction handlers
  const handleTabHover = useCallback(async (tabId: number) => {
    try {
      if (!originalTab) {
        const activeTab = await tabService.getActiveTab();
        if (activeTab && activeTab.id && activeTab.id !== tabId) {
          setOriginalTab(activeTab);
        }
      }
      
      if (previewTabId !== tabId) {
        await tabService.activateTab(tabId);
        setPreviewTabId(tabId);
      }
    } catch (error) {
      console.error('Failed to preview tab on hover:', error);
    }
  }, [originalTab, previewTabId]);

  const handleTabHoverEnd = useCallback(async () => {
    try {
      if (originalTab && originalTab.id && previewTabId !== originalTab.id) {
        await tabService.activateTab(originalTab.id);
      }
    } catch (error) {
      console.error('Failed to return to original tab:', error);
    }
  }, [originalTab, previewTabId]);

  const handleTabClick = useCallback((tabId: number) => {
    const clickedTab = allTabs.find(tab => tab.id === tabId);
    if (clickedTab) {
      setOriginalTab(clickedTab);
      setPreviewTabId(null);
    }
  }, [allTabs]);

  // Set up event listeners
  useEffect(() => {
    browser.tabs.onRemoved.addListener(handleTabRemoved);
    browser.tabs.onUpdated.addListener(handleTabUpdated);
    browser.tabs.onCreated.addListener(handleTabCreated);
    browser.tabs.onMoved.addListener(handleTabMoved);
    browser.tabs.onReplaced.addListener(handleTabReplaced);
    browser.tabs.onActivated.addListener(handleTabActivated);
    browser.windows.onFocusChanged.addListener(handleWindowFocusChanged);
    
    // Add tab group event listeners
    if (browser.tabGroups) {
      console.log('Adding tab group event listeners');
      browser.tabGroups.onCreated.addListener(handleTabGroupCreated);
      browser.tabGroups.onUpdated.addListener(handleTabGroupUpdated);
      browser.tabGroups.onRemoved.addListener(handleTabGroupRemoved);
    } else {
      console.log('browser.tabGroups not available, skipping event listeners');
    }
    
    return () => {
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
      browser.tabs.onCreated.removeListener(handleTabCreated);
      browser.tabs.onMoved.removeListener(handleTabMoved);
      browser.tabs.onReplaced.removeListener(handleTabReplaced);
      browser.tabs.onActivated.removeListener(handleTabActivated);
      browser.windows.onFocusChanged.removeListener(handleWindowFocusChanged);
      
      // Remove tab group event listeners
      if (browser.tabGroups) {
        browser.tabGroups.onCreated.removeListener(handleTabGroupCreated);
        browser.tabGroups.onUpdated.removeListener(handleTabGroupUpdated);
        browser.tabGroups.onRemoved.removeListener(handleTabGroupRemoved);
      }
    };
  }, [
    handleTabRemoved, handleTabUpdated, handleTabCreated, handleTabMoved,
    handleTabReplaced, handleTabActivated, handleWindowFocusChanged, 
    handleTabGroupCreated, handleTabGroupUpdated, handleTabGroupRemoved
  ]);

  // Initialize on mount
  useEffect(() => {
    initializeTabsInfo();
  }, [initializeTabsInfo]);

  return {
    allTabs,
    tabGroups,
    originalTab,
    previewTabId,
    originalTabIndex,
    handleTabHover,
    handleTabHoverEnd,
    handleTabClick,
    setOriginalTab,
    setPreviewTabId
  };
}
