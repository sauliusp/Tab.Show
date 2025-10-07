import { useState, useEffect, useCallback, useRef } from 'react';
import { Tab, TabGroup, TabListItem, TabListState } from '../types/Tab';
import { tabService } from '../services/TabService';

const HOVER_SWITCH_TIMEOUT = 500;

export function useTabs() {
  const [tabListState, setTabListState] = useState<TabListState>({
    items: {},
    itemOrder: [],
    groupExpansionState: {}
  });
  const [originalTab, setOriginalTab] = useState<Tab | null>(null);
  const [previewTabId, setPreviewTabId] = useState<number | null>(null);
  const [originalTabIndex, setOriginalTabIndex] = useState<number>(-1);
  const [activeDragItem, setActiveDragItem] = useState<any | null>(null);
  const [overDragItem, setOverDragItem] = useState<any | null>(null);

  const isSwitchingOnHoverRef = useRef(false);
  const hoverSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoverOperationInProgressRef = useRef(false);

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
      
      if (tab.groupId && groupMap.has(tab.groupId)) {
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

    console.log('buildTabListState - tabs order:', tabs.map((t, i) => ({ index: i, id: t.id, title: t.title, groupId: t.groupId })));
    console.log('buildTabListState - itemOrder:', itemOrder);
    console.log('buildTabListState - items:', Object.keys(items).map(id => ({
      id,
      type: items[id].type,
      parentId: items[id].parentId,
      title: items[id].type === 'tab' 
        ? (items[id].data as Tab).title 
        : (items[id].data as TabGroup).title
    })));

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
    try {
      const [windowTabs, groups] = await Promise.all([
        tabService.getAllTabs(),
        tabService.getTabGroups()
      ]);
      const newTabListState = buildTabListState(windowTabs, groups);
      setTabListState(newTabListState);
    } catch (error) {
      logError('refresh tab data', error);
    }
  }, [logError, buildTabListState]);

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
  }, [logError, buildTabListState]);

  const handleTabGroupCreated = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
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
  }, [logError, buildTabListState]);

  const handleTabGroupRemoved = useCallback(async () => {
    try {
      const groups = await tabService.getTabGroups();
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
  }, [logError, buildTabListState]);

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
      
      const newTabListState = buildTabListState(windowTabs, groups);
      setTabListState(newTabListState);
    } catch (error) {
      logError('initialize tabs information', error);
    }
  }, [logError, buildTabListState]);

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
    if (changeInfo.status || changeInfo.groupId || changeInfo.favIconUrl || changeInfo.title || changeInfo.url) {
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
      if (changeInfo.groupId) {
        handleTabGroupUpdated();
      }
    }
  }, [originalTab, tabListState, handleTabGroupUpdated]);

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
  }, [originalTab, previewTabId, logError, buildTabListState]);

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
    const tabItem = tabListState.items[tabItemId];
    if (tabItem && tabItem.type === 'tab') {
      const clickedTab = tabItem.data as Tab;
      setOriginalTab(clickedTab);
      setPreviewTabId(null);
    }
  }, [tabListState]);

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

  const handleDragStart = useCallback((event: any) => {
    setActiveDragItem(event.active);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    const { over } = event;
    setOverDragItem(over);
  }, []);

  const handleDragEnd = useCallback(async (event: any) => {
    const { active, over } = event;

    // Reset tracking state
    setActiveDragItem(null);
    setOverDragItem(null);

    if (!active || !over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeItem = tabListState.items[activeId];
    const overItem = tabListState.items[overId];

    // Determine the parent group IDs
    const activeItemGroupId = activeItem?.parentId;
    const overItemGroupId = overItem?.parentId;

    // Scenario 1: Reordering within the same context (same group or both ungrouped)
    if (activeItemGroupId === overItemGroupId) {
      // This is the simple reorder we already implemented.
      // Let's call the browser API directly.
      try {
        const allTabs = await tabService.getAllTabs();
        const tabIdToMove = parseInt(activeId.replace('tab-', ''));
        const overTabId = parseInt(overId.replace('tab-', ''));
        const newIndex = allTabs.findIndex(t => t.id === overTabId);

        if (newIndex !== -1) {
          await tabService.moveTab(tabIdToMove, newIndex);
        }
      } catch (error) {
        console.error('Error during simple reorder:', error);
        await refreshTabData(); // Revert on error
      }
      return;
    }

    // Scenario 2: Moving an item into or out of a group
    try {
      const tabIdToMove = parseInt(activeId.replace('tab-', ''));
      let targetGroupId: number | null = null;
      let newIndex = -1;

      // Find the new group and index
      const allTabs = await tabService.getAllTabs();
      const overTabId = parseInt(overId.replace('tab-', ''));
      const overTab = allTabs.find(t => t.id === overTabId);
      
      if (overTab) {
        newIndex = allTabs.findIndex(t => t.id === overTabId);
        // The new group ID is the group ID of the item we are dropping on.
        // If it's undefined, the tab becomes ungrouped.
        targetGroupId = overTab.groupId ?? null; 
      } else {
          // Handle dropping on a group header
          if (overId.startsWith('group-')) {
              targetGroupId = parseInt(overId.replace('group-', ''));
              // Move it to the end of the group
              const groupTabs = allTabs.filter(t => t.groupId === targetGroupId);
              if (groupTabs.length > 0) {
                   newIndex = allTabs.findIndex(t => t.id === groupTabs[groupTabs.length-1].id) +1;
              } else {
                   // if group is empty, find group header to determine index
                   // for now, let's just move to the end of all tabs
                   newIndex = -1;
              }
          }
      }


      if (newIndex === -1) return;

      // First, move the tab to its new group
      if (targetGroupId !== null) {
        await browser.tabs.group({ tabIds: tabIdToMove, groupId: targetGroupId });
      } else {
        // Ungroup the tab if it's dropped outside any group context
        await browser.tabs.ungroup(tabIdToMove);
      }
      
      // Then, move the tab to its final index
      await tabService.moveTab(tabIdToMove, newIndex);

    } catch (error) {
      console.error('Error during complex reorder:', error);
      await refreshTabData();
    }

  }, [tabListState, refreshTabData]);

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
    tabListState,
    originalTab,
    previewTabId,
    originalTabIndex,
    handleTabHover,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleGroupToggle,
    setOriginalTab,
    setPreviewTabId,
    handleDragEnd,
    handleDragStart,
    handleDragOver
  };
}
