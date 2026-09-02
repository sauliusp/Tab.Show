import React from 'react';
import { Tab, TabGroup } from '../types/Tab';
import { tabService } from '../services/TabService';
import { ChaosTrend, tabChaosHistoryService } from '../services/TabChaosHistoryService';
import { calculateTabChaos, TabChaosStats } from '../utils/tabChaos';

export function useTabChaos() {
  const [stats, setStats] = React.useState<TabChaosStats | null>(null);
  const [trend, setTrend] = React.useState<ChaosTrend | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const recordedRef = React.useRef(false);
  const refreshTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      const [tabs, groups, currentWindowId] = await Promise.all([
        browser.tabs.query({}) as Promise<Tab[]>,
        browser.tabGroups ? browser.tabGroups.query({}) as Promise<TabGroup[]> : Promise.resolve([]),
        tabService.getCurrentWindowId(),
      ]);
      const currentTab = tabs.find(tab => tab.active && tab.windowId === currentWindowId);
      const nextStats = calculateTabChaos(tabs, groups, {
        currentWindowId,
        currentTabId: currentTab?.id,
      });
      setStats(nextStats);
      if (!recordedRef.current) {
        recordedRef.current = true;
        setTrend(tabChaosHistoryService.recordCheckIn(nextStats));
      }
    } catch (error) {
      console.error('Failed to calculate Tab Chaos Score:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleRefresh = React.useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => { void refresh(); }, 120);
  }, [refresh]);

  React.useEffect(() => {
    void refresh();
    browser.tabs.onCreated.addListener(scheduleRefresh);
    browser.tabs.onRemoved.addListener(scheduleRefresh);
    browser.tabs.onUpdated.addListener(scheduleRefresh);
    browser.tabs.onMoved.addListener(scheduleRefresh);
    browser.tabs.onActivated.addListener(scheduleRefresh);
    browser.windows.onFocusChanged.addListener(scheduleRefresh);
    browser.tabGroups?.onCreated.addListener(scheduleRefresh);
    browser.tabGroups?.onUpdated.addListener(scheduleRefresh);
    browser.tabGroups?.onRemoved.addListener(scheduleRefresh);
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      browser.tabs.onCreated.removeListener(scheduleRefresh);
      browser.tabs.onRemoved.removeListener(scheduleRefresh);
      browser.tabs.onUpdated.removeListener(scheduleRefresh);
      browser.tabs.onMoved.removeListener(scheduleRefresh);
      browser.tabs.onActivated.removeListener(scheduleRefresh);
      browser.windows.onFocusChanged.removeListener(scheduleRefresh);
      browser.tabGroups?.onCreated.removeListener(scheduleRefresh);
      browser.tabGroups?.onUpdated.removeListener(scheduleRefresh);
      browser.tabGroups?.onRemoved.removeListener(scheduleRefresh);
    };
  }, [refresh, scheduleRefresh]);

  return { stats, trend, isLoading };
}
