import { useState, useEffect, useCallback, useRef } from 'react';
import { Tab } from '../types/Tab';
import { tabService } from '../services/TabService';

const PREVIEW_MODE_TIMEOUT = 500;
const HOVER_SWITCH_TIMEOUT = 500;

export function useTabs() {
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [tabGroups, setTabGroups] = useState<any[]>([]);
  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const [originalTabIndex, setOriginalTabIndex] = useState<number>(-1);

  const isSwitchingOnHoverRef = useRef(false);
  const hoverSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Utility functions for common patterns
  const logError = useCallback((context: string, error: unknown) => {
    console.error(`Failed to ${context}:`, error);
  }, []);

  const refreshTabData = useCallback(async () => {
    try {
      const [windowTabs, groups] = await Promise.all([
        tabService.getAllTabs(),
        tabService.getTabGroups()
      ]);
      setAllTabs(windowTabs);
      setTabGroups(groups);
    } catch (error) {
      logError('refresh tab data', error);
    }
  }, [logError]);

  const clearHoverSwitchFlag = useCallback(() => {
    isSwitchingOnHoverRef.current = false;
    if (hoverSwitchTimeoutRef.current) {
      clearTimeout(hoverSwitchTimeoutRef.current);
      hoverSwitchTimeoutRef.current = null;
    }
  }, []);

  const setHoverSwitchFlag = useCallback(() => {
    isSwitchingOnHoverRef.current = true;
    hoverSwitchTimeoutRef.current = setTimeout(() => {
      console.warn('Failsafe: Resetting hover flag.');
      isSwitchingOnHoverRef.current = false;
    }, HOVER_SWITCH_TIMEOUT);
  }, []);

  const executeProgrammaticTabSwitch = useCallback(async (tabId: number, context: string) => {
    try {
      await tabService.activateTab(tabId);
    } catch (error) {
      logError(context, error);
      clearHoverSwitchFlag();
      throw error;
    }
  }, [logError, clearHoverSwitchFlag]);

  // Tab group event handlers
  const handleTabGroupUpdated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupUpdated - fetched groups:', groups);
      setTabGroups(groups);
    } catch (error) {
      logError('update tab groups', error);
    }
  }, [logError]);

  const handleTabGroupCreated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupCreated - fetched groups:', groups);
      setTabGroups(groups);
    } catch (error) {
      logError('update tab groups after creation', error);
    }
  }, [logError]);

  const handleTabGroupRemoved = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupRemoved - fetched groups:', groups);
      setTabGroups(groups);
    } catch (error) {
      logError('update tab groups after removal', error);
    }
  }, [logError]);

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
      logError('initialize tabs information', error);
    }
  }, [logError]);

  // Tab event handlers
  const handleTabRemoved = useCallback((tabId: number) => {
    setAllTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
    
    // Batch these state updates together
    setOriginalTab(prev => prev?.id === tabId ? null : prev);
    setPreviewTabId(prev => prev === tabId ? null : prev);
  }, []);

  const handleTabUpdated = useCallback((tabId: number, changeInfo: any, updatedTab: any) => {
    if (changeInfo.status || changeInfo.groupId) {
      setAllTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === tabId ? { ...tab, ...updatedTab } : tab
        )
      );
      
      // Batch original tab updates
      if (originalTab?.id === tabId) {
        setOriginalTab(prev => prev ? { ...prev, ...updatedTab } : null);
        
        // Update original tab index in the same update
        setOriginalTabIndex(prev => {
          const newIndex = allTabs.findIndex(tab => tab.id === tabId);
          return newIndex !== -1 ? newIndex : prev;
        });
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
        await refreshTabData();
      }
    } catch (error) {
      logError('handle tab creation', error);
    }
  }, [refreshTabData, logError]);

  const handleTabMoved = useCallback(async () => {
    try {
      await refreshTabData();
    } catch (error) {
      logError('handle tab move', error);
    }
  }, [refreshTabData, logError]);

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
      logError('handle tab replacement', error);
    }
  }, [originalTab, previewTabId, logError]);

  const handleTabActivated = useCallback(async (activeInfo: any) => {
    if (isSwitchingOnHoverRef.current) {
      console.log(`Programmatic switch to tab ${activeInfo.tabId} detected. Resetting flag.`);
      clearHoverSwitchFlag();
      return; 
    }

    console.log(`MANUAL switch to tab ${activeInfo.tabId} detected (Keyboard or Mouse).`);
    try {
      const activatedTab = await tabService.getTabById(activeInfo.tabId);
      if (activatedTab) {
        setOriginalTab(activatedTab);
        setPreviewTabId(null);
      }
    } catch (error) {
      logError(`get tab info for tabId: ${activeInfo.tabId}`, error);
    }
  }, [clearHoverSwitchFlag, logError]);

  const handleWindowFocusChanged = useCallback(async (windowId: number) => {
    try {
      const currentWindowId = await tabService.getCurrentWindowId();
      if (windowId === currentWindowId) {
        await refreshTabData();
      }
    } catch (error) {
      logError('handle window focus change', error);
    }
  }, [refreshTabData, logError]);

  // Tab interaction handlers
  const handleTabHover = useCallback(async (tabId: number) => {
    const currentActiveTab = previewTabId || originalTab?.id;
    if (tabId === currentActiveTab) {
      return; // No action needed if hovering over the already active tab
    }
    
    console.log(`Hover detected on tab ${tabId}. Preparing to preview.`);
    
    // 1. SET THE FLAG: Tell the hook a programmatic switch is about to happen.
    setHoverSwitchFlag();

    try {
      // 2. PERFORM THE ACTION: Activate the tab. This will trigger onActivated.
      await executeProgrammaticTabSwitch(tabId, 'preview tab on hover');
      // 3. UPDATE STATE: After the action, update the UI state to reflect the preview.
      setPreviewTabId(tabId);
    } catch (error) {
      // Error handling is already done in executeProgrammaticTabSwitch
    }
  }, [previewTabId, originalTab, setHoverSwitchFlag, executeProgrammaticTabSwitch]);

  const handleTabClick = useCallback((tabId: number) => {
    const clickedTab = allTabs.find(tab => tab.id === tabId);
    if (clickedTab) {
      setOriginalTab(clickedTab);
      setPreviewTabId(null);
    }
  }, [allTabs]);

  const handleSidePanelHoverEnd = useCallback(async () => {
    if (originalTab?.id && previewTabId) {
      console.log(`Hover ended. Returning to original tab ${originalTab.id}`);
      
      // 1. SET THE FLAG: A programmatic switch back is about to happen.
      setHoverSwitchFlag();

      try {
        // 2. PERFORM THE ACTION: Return to the original tab.
        await executeProgrammaticTabSwitch(originalTab.id, 'return to original tab');
        // 3. UPDATE STATE: End the preview session.
        setPreviewTabId(null);
      } catch (error) {
        // Error handling is already done in executeProgrammaticTabSwitch
      }
    }
  }, [originalTab, previewTabId, setHoverSwitchFlag, executeProgrammaticTabSwitch]);

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
    handleTabGroupCreated, handleTabGroupUpdated, handleTabGroupRemoved,
    clearHoverSwitchFlag
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
    handleSidePanelHoverEnd,
    handleTabClick,
    setOriginalTab,
    setPreviewTabId
  };
}
