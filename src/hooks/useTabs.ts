import { useState, useEffect, useCallback, useRef } from 'react';
import type { Tab, TabGroup, TabListItem, TabListState } from '../types/Tab';
import { tabService } from '../services/TabService';
import { DEFAULT_HOVER_PREVIEW_DELAY_MS } from '../services/UserSettingsService';

const HOVER_SWITCH_TIMEOUT = 500;

interface UseTabsOptions {
  hoverPreviewDelayMs?: number;
  allWindows?: boolean;
}

export function useTabs({
  hoverPreviewDelayMs = DEFAULT_HOVER_PREVIEW_DELAY_MS,
  allWindows = false
}: UseTabsOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [tabListState, setTabListState] = useState<TabListState>({
    items: {},
    itemOrder: [],
    groupExpansionState: {}
  });
  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const [originalTabIndex, setOriginalTabIndex] = useState<number>(-1);

  const isSwitchingOnHoverRef = useRef(false);
  const hoverSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoverOperationInProgressRef = useRef(false);
  const hoverPreviewDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingHoverTabIdRef = useRef<number | null>(null);
  const hostWindowIdRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const refreshGenerationRef = useRef(0);
  const interactionGenerationRef = useRef(0);
  const tabSwitchQueueRef = useRef<Promise<void>>(Promise.resolve());
  const programmaticTargetTabIdRef = useRef<number | null>(null);
  const inFlightPreviewTabIdRef = useRef<number | null>(null);
  const restorationQueuedRef = useRef(false);
  const committingSelectionRef = useRef(false);

  // Helper function to build tab list state from tabs and groups
  const buildTabListState = useCallback((tabs: Tab[], groups: TabGroup[]): TabListState => {
    const items: Record<string, TabListItem> = {};
    const itemOrder: string[] = [];
    const groupExpansionState: Record<number, boolean> = {};

    // Create a map of group IDs to groups for quick lookup
    const groupMap = new Map(groups.map(group => [group.id, group]));

    // Process tabs in their EXACT order from the browser API to mirror the tab bar
    let currentGroupId: number | null = null;
    
    tabs.forEach((tab, index) => {
      if (!tab.id) return;
      
      const tabItemId = `tab-${tab.id}`;
      
      if (tab.groupId !== undefined && tab.groupId >= 0 && groupMap.has(tab.groupId)) {
        // This tab belongs to a group
        const group = groupMap.get(tab.groupId)!;
        
        // If this is a new group, create a group header
        if (currentGroupId !== group.id) {
          const groupItemId = `group-${group.id}`;
          items[groupItemId] = {
            id: groupItemId,
            type: 'group',
            data: group
          };
          itemOrder.push(groupItemId);
          
          // Set initial expansion state (default to expanded)
          groupExpansionState[group.id] = group.collapsed !== true;
          
          currentGroupId = group.id;
        }
        
        // Add tab as nested item
        items[tabItemId] = {
          id: tabItemId,
          type: 'tab',
          data: tab,
          parentId: `group-${group.id}`
        };
      } else {
        // Ungrouped tab - reset current group and add directly to main order
        currentGroupId = null;
        items[tabItemId] = {
          id: tabItemId,
          type: 'tab',
          data: tab
        };
        itemOrder.push(tabItemId);
      }
    });

    return {
      items,
      itemOrder,
      groupExpansionState
    };
  }, []);

  // Utility functions for common patterns
  const logError = useCallback((context: string, error: unknown) => {
    console.error(`Failed to ${context}:`, error);
  }, []);

  const refreshTabData = useCallback(async () => {
    const generation = ++refreshGenerationRef.current;
    try {
      const [windowTabs, groups] = await Promise.all([
        tabService.getAllTabs(allWindows),
        tabService.getTabGroups(allWindows)
      ]);
      if (generation === refreshGenerationRef.current) {
        const newTabListState = buildTabListState(windowTabs, groups);
        setTabListState(newTabListState);
      }
    } catch (error) {
      logError('refresh tab data', error);
    }
  }, [logError, buildTabListState, allWindows]);

  const clearHoverSwitchFlag = useCallback(() => {
    isSwitchingOnHoverRef.current = false;
    programmaticTargetTabIdRef.current = null;
    if (hoverSwitchTimeoutRef.current) {
      clearTimeout(hoverSwitchTimeoutRef.current);
      hoverSwitchTimeoutRef.current = null;
    }
  }, []);

  const clearHoverPreviewDelayTimeout = useCallback(() => {
    if (hoverPreviewDelayTimeoutRef.current) {
      clearTimeout(hoverPreviewDelayTimeoutRef.current);
      hoverPreviewDelayTimeoutRef.current = null;
    }
    pendingHoverTabIdRef.current = null;
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

  const queueProgrammaticTabSwitch = useCallback((tabId: number, context: string) => {
    const operation = tabSwitchQueueRef.current.then(() => {
      programmaticTargetTabIdRef.current = tabId;
      setHoverSwitchFlag();
      return executeProgrammaticTabSwitch(tabId, context);
    });
    tabSwitchQueueRef.current = operation.catch(() => undefined);
    return operation;
  }, [executeProgrammaticTabSwitch, setHoverSwitchFlag]);

  // Tab group event handlers
  const handleTabGroupUpdated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups(allWindows);
      console.log('handleTabGroupUpdated - fetched groups:', groups);
      setTabListState(prevState => {
        const newState = buildTabListState(
          Object.values(prevState.items)
            .filter(item => item.type === 'tab')
            .map(item => item.data as Tab),
          groups
        );
        
        // Update expansion state based on actual browser state
        const updatedExpansionState: Record<number, boolean> = {};
        groups.forEach(group => {
          updatedExpansionState[group.id] = group.collapsed !== true;
        });
        
        return {
          ...newState,
          groupExpansionState: updatedExpansionState
        };
      });
    } catch (error) {
      logError('update tab groups', error);
    }
  }, [logError, buildTabListState, allWindows]);

  const handleTabGroupCreated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups(allWindows);
      console.log('handleTabGroupCreated - fetched groups:', groups);
      setTabListState(prevState => {
        const newState = buildTabListState(
          Object.values(prevState.items)
            .filter(item => item.type === 'tab')
            .map(item => item.data as Tab),
          groups
        );
        // Preserve existing expansion state
        return {
          ...newState,
          groupExpansionState: { ...prevState.groupExpansionState, ...newState.groupExpansionState }
        };
      });
    } catch (error) {
      logError('update tab groups after creation', error);
    }
  }, [logError, buildTabListState, allWindows]);

  const handleTabGroupRemoved = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups(allWindows);
      console.log('handleTabGroupRemoved - fetched groups:', groups);
      setTabListState(prevState => {
        const newState = buildTabListState(
          Object.values(prevState.items)
            .filter(item => item.type === 'tab')
            .map(item => item.data as Tab),
          groups
        );
        // Preserve existing expansion state
        return {
          ...newState,
          groupExpansionState: { ...prevState.groupExpansionState, ...newState.groupExpansionState }
        };
      });
    } catch (error) {
      logError('update tab groups after removal', error);
    }
  }, [logError, buildTabListState, allWindows]);

  // Initialize tabs information
  const initializeTabsInfo = useCallback(async () => {
    try {
      const [activeTab, windowTabs, groups] = await Promise.all([
        tabService.getActiveTab(),
        tabService.getAllTabs(allWindows),
        tabService.getTabGroups(allWindows)
      ]);
      
      hostWindowIdRef.current = await tabService.getCurrentWindowId();
      if (!initializedRef.current && activeTab && activeTab.id) {
        setOriginalTab(activeTab);
        const index = windowTabs.findIndex(tab => tab.id === activeTab.id);
        setOriginalTabIndex(index);
      }
      
      const newTabListState = buildTabListState(windowTabs, groups);
      setTabListState(newTabListState);
      initializedRef.current = true;
    } catch (error) {
      logError('initialize tabs information', error);
    } finally {
      setIsLoading(false);
    }
  }, [logError, buildTabListState, allWindows]);

  // Tab event handlers
  const handleTabRemoved = useCallback((tabId: number) => {
    setTabListState(prevState => {
      const newItems = { ...prevState.items };
      const newItemOrder = [...prevState.itemOrder];
      
      // Remove the tab item
      const tabItemId = `tab-${tabId}`;
      delete newItems[tabItemId];
      
      // Remove from order array
      const orderIndex = newItemOrder.indexOf(tabItemId);
      if (orderIndex !== -1) {
        newItemOrder.splice(orderIndex, 1);
      }
      
      return {
        ...prevState,
        items: newItems,
        itemOrder: newItemOrder
      };
    });
    
    // Batch these state updates together
    setOriginalTab(prev => prev?.id === tabId ? null : prev);
    setPreviewTabId(prev => prev === tabId ? null : prev);
  }, []);

  const handleTabUpdated = useCallback((tabId: number, changeInfo: any, updatedTab: any) => {
    if (changeInfo.status || changeInfo.groupId !== undefined || changeInfo.favIconUrl || changeInfo.title || changeInfo.url || changeInfo.pinned !== undefined || changeInfo.audible !== undefined || changeInfo.mutedInfo || changeInfo.discarded !== undefined) {
      setTabListState(prevState => {
        const newItems = { ...prevState.items };
        const tabItemId = `tab-${tabId}`;
        
        if (newItems[tabItemId]) {
          newItems[tabItemId] = {
            ...newItems[tabItemId],
            data: { ...newItems[tabItemId].data as Tab, ...updatedTab }
          };
        }
        
        return {
          ...prevState,
          items: newItems
        };
      });
      
      // Batch original tab updates
      if (originalTab?.id === tabId) {
        setOriginalTab(prev => prev ? { ...prev, ...updatedTab } : null);
        
        // Update original tab index in the same update
        setOriginalTabIndex(prev => {
          const allTabs = Object.values(tabListState.items)
            .filter(item => item.type === 'tab')
            .map(item => item.data as Tab);
          const newIndex = allTabs.findIndex(tab => tab.id === tabId);
          return newIndex !== -1 ? newIndex : prev;
        });
      }

      // If groupId changed, refresh tab groups
      if (changeInfo.groupId !== undefined) {
        handleTabGroupUpdated();
      }
    }
  }, [originalTab, tabListState, handleTabGroupUpdated]);

  const handleTabCreated = useCallback(async (tab: any) => {
    try {
      const currentWindowId = await tabService.getCurrentWindowId();
      if (allWindows || tab.windowId === currentWindowId) {
        await refreshTabData();
      }
    } catch (error) {
      logError('handle tab creation', error);
    }
  }, [refreshTabData, logError, allWindows]);

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
        tabService.getAllTabs(allWindows),
        tabService.getTabGroups(allWindows)
      ]);
      const newTabListState = buildTabListState(windowTabs, groups);
      setTabListState(newTabListState);
      
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
  }, [originalTab, previewTabId, logError, buildTabListState, allWindows]);

  const handleTabActivated = useCallback(async (activeInfo: any) => {
    if (isSwitchingOnHoverRef.current && programmaticTargetTabIdRef.current === activeInfo.tabId) {
      console.log(`Programmatic switch to tab ${activeInfo.tabId} detected. Resetting flag.`);
      clearHoverSwitchFlag();
      return; 
    }

    if (isSwitchingOnHoverRef.current) clearHoverSwitchFlag();

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
      if (allWindows || windowId === hostWindowIdRef.current) {
        await refreshTabData();
      }
    } catch (error) {
      logError('handle window focus change', error);
    }
  }, [refreshTabData, logError, allWindows]);

  // Tab interaction handlers
  const performTabHover = useCallback(async (tabId: number, generation: number) => {
    const currentActiveTab = previewTabId || originalTab?.id;
    if (tabId === currentActiveTab) {
      return; // No action needed if hovering over the already active tab
    }

    // Activating a tab in another window requires focusing that window. A hover
    // preview must never pull a different Chrome window to the foreground; users
    // can still explicitly click the row to switch windows.
    const hoveredItem = tabListState.items[`tab-${tabId}`];
    const hoveredTab = hoveredItem?.type === 'tab' ? hoveredItem.data as Tab : null;
    if (hoveredTab?.windowId !== undefined && hoveredTab.windowId !== hostWindowIdRef.current) {
      return;
    }
    
    console.log(`Hover detected on tab ${tabId}. Preparing to preview.`);
    
    // Mark hover operation as in progress
    isHoverOperationInProgressRef.current = true;
    inFlightPreviewTabIdRef.current = tabId;
    
    try {
      // 2. PERFORM THE ACTION: Activate the tab. This will trigger onActivated.
      await queueProgrammaticTabSwitch(tabId, 'preview tab on hover');
      // 3. UPDATE STATE: After the action, update the UI state to reflect the preview.
      if (generation === interactionGenerationRef.current) setPreviewTabId(tabId);
    } catch (error) {
      // Error handling is already done in executeProgrammaticTabSwitch
    } finally {
      // Always clear the hover operation flag
      isHoverOperationInProgressRef.current = false;
      if (inFlightPreviewTabIdRef.current === tabId) {
        inFlightPreviewTabIdRef.current = null;
      }
    }
  }, [previewTabId, originalTab, tabListState.items, queueProgrammaticTabSwitch]);

  const handleTabHover = useCallback((tabId: number) => {
    const generation = ++interactionGenerationRef.current;
    const currentActiveTab = previewTabId || originalTab?.id;
    if (tabId === currentActiveTab) {
      clearHoverPreviewDelayTimeout();
      return;
    }

    pendingHoverTabIdRef.current = tabId;

    if (hoverPreviewDelayMs <= 0) {
      clearHoverPreviewDelayTimeout();
      void performTabHover(tabId, generation);
      return;
    }

    if (hoverPreviewDelayTimeoutRef.current) {
      clearTimeout(hoverPreviewDelayTimeoutRef.current);
      hoverPreviewDelayTimeoutRef.current = null;
    }

    hoverPreviewDelayTimeoutRef.current = setTimeout(() => {
      hoverPreviewDelayTimeoutRef.current = null;
      if (pendingHoverTabIdRef.current !== tabId) {
        return;
      }
      pendingHoverTabIdRef.current = null;
      void performTabHover(tabId, generation);
    }, hoverPreviewDelayMs);
  }, [
    previewTabId,
    originalTab,
    hoverPreviewDelayMs,
    performTabHover,
    clearHoverPreviewDelayTimeout
  ]);

  const handleTabHoverEnd = useCallback((tabId: number) => {
    if (pendingHoverTabIdRef.current === tabId) {
      interactionGenerationRef.current += 1;
      clearHoverPreviewDelayTimeout();
    }
  }, [clearHoverPreviewDelayTimeout]);

  const cancelPendingPreview = useCallback(() => {
    interactionGenerationRef.current += 1;
    clearHoverPreviewDelayTimeout();
  }, [clearHoverPreviewDelayTimeout]);

  const handleTabClick = useCallback(async (tabId: number) => {
    committingSelectionRef.current = true;
    interactionGenerationRef.current += 1;
    clearHoverPreviewDelayTimeout();
    setPreviewTabId(null);
    const tabItemId = `tab-${tabId}`;
    const tabItem = tabListState.items[tabItemId];
    if (tabItem && tabItem.type === 'tab') {
      const clickedTab = tabItem.data as Tab;
      try {
        await queueProgrammaticTabSwitch(tabId, 'select tab');
        setOriginalTab(clickedTab);
        setPreviewTabId(null);
        await tabService.closeSidePanel(hostWindowIdRef.current ?? undefined);
      } catch (error) {
        committingSelectionRef.current = false;
        logError('select tab and close side panel', error);
      }
    } else {
      committingSelectionRef.current = false;
    }
  }, [tabListState, clearHoverPreviewDelayTimeout, queueProgrammaticTabSwitch, logError]);

  const handleCancel = useCallback(async () => {
    interactionGenerationRef.current += 1;
    clearHoverPreviewDelayTimeout();
    if (originalTab?.id) {
      try {
        await queueProgrammaticTabSwitch(originalTab.id, 'restore original tab');
      } catch {
        // Closing the panel is still the least surprising fallback.
      }
    }
    setPreviewTabId(null);
    try {
      await tabService.closeSidePanel(hostWindowIdRef.current ?? undefined);
    } catch (error) {
      logError('close side panel', error);
    }
  }, [originalTab, clearHoverPreviewDelayTimeout, queueProgrammaticTabSwitch, logError]);

  const handleSidePanelHoverEnd = useCallback(async () => {
    interactionGenerationRef.current += 1;
    clearHoverPreviewDelayTimeout();
    const previewMayBeActive = previewTabId !== null || inFlightPreviewTabIdRef.current !== null;
    if (originalTab?.id && previewMayBeActive && !committingSelectionRef.current && !restorationQueuedRef.current) {
      restorationQueuedRef.current = true;
      console.log(`Hover ended. Returning to original tab ${originalTab.id}`);
      
      // Clear any ongoing hover operations
      isHoverOperationInProgressRef.current = false;
      
      // 1. SET THE FLAG: A programmatic switch back is about to happen.
      try {
        // 2. PERFORM THE ACTION: Return to the original tab.
        await queueProgrammaticTabSwitch(originalTab.id, 'return to original tab');
        // 3. UPDATE STATE: End the preview session.
        setPreviewTabId(null);
      } catch (error) {
        // Error handling is already done in executeProgrammaticTabSwitch
      } finally {
        restorationQueuedRef.current = false;
      }
    }
  }, [originalTab, previewTabId, queueProgrammaticTabSwitch, clearHoverPreviewDelayTimeout]);

  // Group expansion handler
  const handleGroupToggle = useCallback(async (groupId: number) => {
    try {
      // Toggle the group in the browser first
      const success = await tabService.toggleTabGroupCollapse(groupId);
      
      if (success) {
        // Update local state to reflect the change
        setTabListState(prevState => ({
          ...prevState,
          groupExpansionState: {
            ...prevState.groupExpansionState,
            [groupId]: !prevState.groupExpansionState[groupId]
          }
        }));
      } else {
        console.error(`Failed to toggle group ${groupId} in browser`);
      }
    } catch (error) {
      logError(`toggle group ${groupId}`, error);
    }
  }, [logError]);

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
    if (!initializedRef.current) void initializeTabsInfo();
    else void refreshTabData();
  }, [initializeTabsInfo, refreshTabData]);

  useEffect(() => {
    return () => {
      clearHoverPreviewDelayTimeout();
    };
  }, [clearHoverPreviewDelayTimeout]);

  return {
    isLoading,
    tabListState,
    originalTab,
    previewTabId,
    originalTabIndex,
    handleTabHover,
    handleTabHoverEnd,
    cancelPendingPreview,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleCancel,
    handleGroupToggle,
    setOriginalTab,
    setPreviewTabId
  };
}
