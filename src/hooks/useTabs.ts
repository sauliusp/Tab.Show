import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Tab, TabGroup, TabListItem, TabListState } from '../types/Tab';
import { tabService } from '../services/TabService';

const HOVER_SWITCH_TIMEOUT = 500;

export type FlatListItem = {
  id: string;
  type: 'tab' | 'group';
  data: Tab | TabGroup;
};

export function useTabs() {
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [allGroups, setAllGroups] = useState<TabGroup[]>([]);
  const [groupExpansionState, setGroupExpansionState] = useState<Record<number, boolean>>({});

  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const [originalTabIndex, setOriginalTabIndex] = useState<number>(-1);
  const [activeDragItem, setActiveDragItem] = useState<any | null>(null);
  const [overDragItem, setOverDragItem] = useState<any | null>(null);

  const isSwitchingOnHoverRef = useRef(false);
  const hoverSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoverOperationInProgressRef = useRef(false);

  const flatTabList = useMemo<FlatListItem[]>(() => {
    const items: FlatListItem[] = [];
    const groupMap = new Map(allGroups.map(g => [g.id, g]));
    let currentGroupId: number | undefined = undefined;

    allTabs.forEach(tab => {
        if (!tab.id) return;
        
        if (tab.groupId && tab.groupId !== -1 && groupMap.has(tab.groupId)) {
            const group = groupMap.get(tab.groupId)!;
            if (currentGroupId !== group.id) {
                items.push({ id: `group-${group.id}`, type: 'group', data: group });
                currentGroupId = group.id;
            }
            if (groupExpansionState[group.id] !== false) { // Default to expanded
                items.push({ id: `tab-${tab.id}`, type: 'tab', data: tab });
            }
        } else {
            currentGroupId = undefined;
            items.push({ id: `tab-${tab.id}`, type: 'tab', data: tab });
        }
    });
    return items;
  }, [allTabs, allGroups, groupExpansionState]);

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
      setAllGroups(groups);

      const newGroupExpansionState: Record<number, boolean> = {};
      groups.forEach(group => {
        newGroupExpansionState[group.id] = group.collapsed !== true;
      });
      setGroupExpansionState(prevState => ({...prevState, ...newGroupExpansionState}));

    } catch (error) {
      logError('refresh tab data', error);
    }
  }, [logError]);
  
  const reorderTabs = useCallback(async (activeId: string, overId: string) => {
    // This function will now contain all the logic to call browser APIs
    // ...
  }, [allTabs]);

  const clearHoverSwitchFlag = useCallback(() => {
    isSwitchingOnHoverRef.current = false;
    if (hoverSwitchTimeoutRef.current) {
      clearTimeout(hoverSwitchTimeoutRef.current);
      hoverSwitchTimeoutRef.current = null;
    }
  }, []);

  const setHoverSwitchFlag = useCallback(() => {
    // Clear any existing timeout before setting a new one
    if (hoverSwitchTimeoutRef.current) {
      clearTimeout(hoverSwitchTimeoutRef.current);
      hoverSwitchTimeoutRef.current = null;
    }
    
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
      setAllGroups(groups);
      const newGroupExpansionState: Record<number, boolean> = {};
      groups.forEach(group => {
        newGroupExpansionState[group.id] = group.collapsed !== true;
      });
      setGroupExpansionState(prevState => ({...prevState, ...newGroupExpansionState}));
    } catch (error) {
      logError('update tab groups', error);
    }
  }, [logError]);

  const handleTabGroupCreated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupCreated - fetched groups:', groups);
      setAllGroups(groups);
      const newGroupExpansionState: Record<number, boolean> = {};
      groups.forEach(group => {
        newGroupExpansionState[group.id] = group.collapsed !== true;
      });
      setGroupExpansionState(prevState => ({...prevState, ...newGroupExpansionState}));
    } catch (error) {
      logError('update tab groups after creation', error);
    }
  }, [logError]);

  const handleTabGroupRemoved = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
      console.log('handleTabGroupRemoved - fetched groups:', groups);
      setAllGroups(groups);
      const newGroupExpansionState: Record<number, boolean> = {};
      groups.forEach(group => {
        newGroupExpansionState[group.id] = group.collapsed !== true;
      });
      setGroupExpansionState(prevState => ({...prevState, ...newGroupExpansionState}));
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
      setAllGroups(groups);
      const newGroupExpansionState: Record<number, boolean> = {};
      groups.forEach(group => {
        newGroupExpansionState[group.id] = group.collapsed !== true;
      });
      setGroupExpansionState(newGroupExpansionState);

    } catch (error) {
      logError('initialize tabs information', error);
    }
  }, [logError]);

  // Tab event handlers
  const handleTabRemoved = useCallback((tabId: number) => {
    setAllTabs(prevState => prevState.filter(tab => tab.id !== tabId));
    setOriginalTab(prev => prev?.id === tabId ? null : prev);
    setPreviewTabId(prev => prev === tabId ? null : prev);
  }, []);

  const handleTabUpdated = useCallback((tabId: number, changeInfo: any, updatedTab: any) => {
    if (changeInfo.status || changeInfo.groupId || changeInfo.favIconUrl || changeInfo.title || changeInfo.url) {
      setAllTabs(prevState => prevState.map(tab => tab.id === tabId ? { ...tab, ...updatedTab } : tab));
      
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
      const [windowTabs, groups] = await Promise.all([
        tabService.getAllTabs(),
        tabService.getTabGroups()
      ]);
      setAllTabs(windowTabs);
      const newGroupExpansionState: Record<number, boolean> = {};
      groups.forEach(group => {
        newGroupExpansionState[group.id] = group.collapsed !== true;
      });
      setGroupExpansionState(prevState => ({...prevState, ...newGroupExpansionState}));
      
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
  }, [originalTab, previewTabId, logError, refreshTabData]);

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
    
    // Prevent overlapping hover operations
    if (isHoverOperationInProgressRef.current) {
      console.log(`Hover operation already in progress, ignoring hover on tab ${tabId}`);
      return;
    }
    
    console.log(`Hover detected on tab ${tabId}. Preparing to preview.`);
    
    // Mark hover operation as in progress
    isHoverOperationInProgressRef.current = true;
    
    // 1. SET THE FLAG: Tell the hook a programmatic switch is about to happen.
    setHoverSwitchFlag();

    try {
      // 2. PERFORM THE ACTION: Activate the tab. This will trigger onActivated.
      await executeProgrammaticTabSwitch(tabId, 'preview tab on hover');
      // 3. UPDATE STATE: After the action, update the UI state to reflect the preview.
      setPreviewTabId(tabId);
    } catch (error) {
      // Error handling is already done in executeProgrammaticTabSwitch
    } finally {
      // Always clear the hover operation flag
      isHoverOperationInProgressRef.current = false;
    }
  }, [previewTabId, originalTab, setHoverSwitchFlag, executeProgrammaticTabSwitch]);

  const handleTabClick = useCallback((tabId: number) => {
    const tabItemId = `tab-${tabId}`;
    const tabItem = flatTabList.find(i => i.id === tabItemId);
    if (tabItem && tabItem.type === 'tab') {
      const clickedTab = tabItem.data as Tab;
      setOriginalTab(clickedTab);
      setPreviewTabId(null);
    }
  }, [flatTabList]);

  const handleSidePanelHoverEnd = useCallback(async () => {
    if (originalTab?.id && previewTabId) {
      console.log(`Hover ended. Returning to original tab ${originalTab.id}`);
      
      // Clear any ongoing hover operations
      isHoverOperationInProgressRef.current = false;
      
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

  // Group expansion handler
  const handleGroupToggle = useCallback(async (groupId: number) => {
    try {
      // Toggle the group in the browser first
      const success = await tabService.toggleTabGroupCollapse(groupId);
      
      if (success) {
        // Update local state to reflect the change
        setGroupExpansionState(prevState => ({
          ...prevState,
          [groupId]: !prevState[groupId]
        }));
      } else {
        console.error(`Failed to toggle group ${groupId} in browser`);
      }
    } catch (error) {
      logError(`toggle group ${groupId}`, error);
    }
  }, [logError]);

  const handleDragStart = useCallback((event: any) => {
    setActiveDragItem(event.active);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    const { over } = event;
    setOverDragItem(over);
  }, []);

  const handleDragEnd = useCallback(async ({ active, over }: { active: any, over: any }) => {
    if (!over || active.id === over.id) return;

    setActiveDragItem(null);
    setOverDragItem(null);

    const activeItem = flatTabList.find(i => i.id === active.id);
    const overItem = flatTabList.find(i => i.id === over.id);
    if (!activeItem || !overItem || activeItem.type !== 'tab') return;
    
    const tabIdToMove = (activeItem.data as Tab).id!;
    const allBrowserTabs = await tabService.getAllTabs();
    
    let targetIndex = -1;
    let targetGroupId: number | undefined = undefined;

    if (overItem.type === 'tab') {
        targetGroupId = (overItem.data as Tab).groupId;
        targetIndex = allBrowserTabs.findIndex(t => t.id === (overItem.data as Tab).id);
    } else { // Dropped on a group header
        targetGroupId = (overItem.data as TabGroup).id;
        const tabsInGroup = allBrowserTabs.filter(t => t.groupId === targetGroupId);
        if (tabsInGroup.length > 0) {
            targetIndex = allBrowserTabs.findIndex(t => t.id === tabsInGroup[tabsInGroup.length - 1].id) + 1;
        } else {
            // Find the first tab AFTER the group header in the browser's list
            // This is complex, so let's approximate by finding the next tab in our flat list
            const overItemIndex = flatTabList.findIndex(i => i.id === over.id);
            const nextItem = flatTabList.slice(overItemIndex + 1).find(i => i.type === 'tab');
            if (nextItem) {
                targetIndex = allBrowserTabs.findIndex(t => t.id === (nextItem.data as Tab).id);
            } else {
                targetIndex = allBrowserTabs.length; // Move to the end
            }
        }
    }
    
    if (targetIndex === -1) return;

    const currentTab = allBrowserTabs.find(t => t.id === tabIdToMove);
    if (currentTab?.groupId !== targetGroupId) {
        if (targetGroupId !== undefined) {
            await tabService.groupTab(tabIdToMove, targetGroupId);
        } else {
            await tabService.ungroupTab(tabIdToMove);
        }
    }
    
    // The tab might have shifted after grouping, so we get a fresh index
    const finalTabs = await tabService.getAllTabs();
    const overTabInFinalList = finalTabs.find(t => t.id === (overItem.type === 'tab' ? (overItem.data as Tab).id : undefined));
    const finalIndex = overTabInFinalList ? finalTabs.indexOf(overTabInFinalList) : targetIndex;

    await tabService.moveTab(tabIdToMove, finalIndex);

  }, [flatTabList, refreshTabData]);

  // Set up event listeners
  useEffect(() => {
    // Most handlers can now just trigger a refresh
    const simpleRefreshHandler = () => refreshTabData();
    
    browser.tabs.onRemoved.addListener(simpleRefreshHandler);
    browser.tabs.onUpdated.addListener(simpleRefreshHandler);
    browser.tabs.onCreated.addListener(simpleRefreshHandler);
    browser.tabs.onMoved.addListener(simpleRefreshHandler);
    browser.tabs.onReplaced.addListener(simpleRefreshHandler);
    browser.tabs.onAttached.addListener(simpleRefreshHandler);
    browser.tabs.onDetached.addListener(simpleRefreshHandler);

    browser.tabs.onActivated.addListener(handleTabActivated);
    browser.windows.onFocusChanged.addListener(handleWindowFocusChanged);
    
    // Add tab group event listeners
    if (browser.tabGroups) {
      console.log('Adding tab group event listeners');
      browser.tabGroups.onCreated.addListener(simpleRefreshHandler);
      browser.tabGroups.onUpdated.addListener(simpleRefreshHandler);
      browser.tabGroups.onRemoved.addListener(simpleRefreshHandler);
    } else {
      console.log('browser.tabGroups not available, skipping event listeners');
    }
    
    return () => {
      browser.tabs.onRemoved.removeListener(simpleRefreshHandler);
      browser.tabs.onUpdated.removeListener(simpleRefreshHandler);
      browser.tabs.onCreated.removeListener(simpleRefreshHandler);
      browser.tabs.onMoved.removeListener(simpleRefreshHandler);
      browser.tabs.onReplaced.removeListener(simpleRefreshHandler);
      browser.tabs.onAttached.removeListener(simpleRefreshHandler);
      browser.tabs.onDetached.removeListener(simpleRefreshHandler);

      browser.tabs.onActivated.removeListener(handleTabActivated);
      browser.windows.onFocusChanged.removeListener(handleWindowFocusChanged);
      
      // Remove tab group event listeners
      if (browser.tabGroups) {
        browser.tabGroups.onCreated.removeListener(simpleRefreshHandler);
        browser.tabGroups.onUpdated.removeListener(simpleRefreshHandler);
        browser.tabGroups.onRemoved.removeListener(simpleRefreshHandler);
      }
    };
  }, [
    handleTabActivated, handleWindowFocusChanged, refreshTabData
  ]);

  // Initialize on mount
  useEffect(() => {
    refreshTabData();
    // Also get the initially active tab
    tabService.getActiveTab().then(activeTab => {
      if (activeTab) {
        setOriginalTab(activeTab);
      }
    });
  }, []);

  return {
    flatTabList,
    originalTab,
    previewTabId,
    activeDragItem,
    handleTabHover,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleGroupToggle,
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    reorderTabs
  };
}
