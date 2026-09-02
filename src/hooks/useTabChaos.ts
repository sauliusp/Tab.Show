import React from 'react';
import { Tab, TabGroup } from '../types/Tab';
import { tabService } from '../services/TabService';
import { ChaosTrend, tabChaosHistoryService } from '../services/TabChaosHistoryService';
import { calculateTabChaos, TabChaosStats } from '../utils/tabChaos';

interface ChaosTrendBaseline {
  previousScore: number | null;
  previousTabCount: number | null;
  bestScore: number;
  checkInStreak: number;
}

function getTrendMessage(scoreDelta: number | null): string {
  if (scoreDelta === null) return 'First local check-in. This becomes more useful over time.';
  if (scoreDelta < 0) return `Down ${Math.abs(scoreDelta)} point${Math.abs(scoreDelta) === 1 ? '' : 's'} since your last check.`;
  if (scoreDelta > 0) return `Up ${scoreDelta} point${scoreDelta === 1 ? '' : 's'} since your last check.`;
  return 'Steady since your last check.';
}

function deriveLiveTrend(stats: TabChaosStats, baseline: ChaosTrendBaseline): ChaosTrend {
  const scoreDelta = baseline.previousScore === null ? null : stats.score - baseline.previousScore;
  const tabsDelta = baseline.previousTabCount === null ? null : stats.totalTabs - baseline.previousTabCount;
  return {
    previousScore: baseline.previousScore,
    scoreDelta,
    tabsDelta,
    bestScore: baseline.bestScore,
    checkInStreak: baseline.checkInStreak,
    message: getTrendMessage(scoreDelta),
  };
}

export function useTabChaos() {
  const [stats, setStats] = React.useState<TabChaosStats | null>(null);
  const [trend, setTrend] = React.useState<ChaosTrend | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const recordedRef = React.useRef(false);
  const trendBaselineRef = React.useRef<ChaosTrendBaseline | null>(null);
  const refreshTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshGenerationRef = React.useRef(0);

  const refresh = React.useCallback(async () => {
    const generation = ++refreshGenerationRef.current;
    try {
      const [tabs, groups, currentWindowId] = await Promise.all([
        browser.tabs.query({}) as Promise<Tab[]>,
        browser.tabGroups ? browser.tabGroups.query({}) as Promise<TabGroup[]> : Promise.resolve([]),
        tabService.getCurrentWindowId(),
      ]);
      if (generation !== refreshGenerationRef.current) return;
      const currentTab = tabs.find(tab => tab.active && tab.windowId === currentWindowId);
      const nextStats = calculateTabChaos(tabs, groups, {
        currentWindowId,
        currentTabId: currentTab?.id,
      });
      setStats(nextStats);
      if (!recordedRef.current) {
        recordedRef.current = true;
        const nextTrend = tabChaosHistoryService.recordCheckIn(nextStats);
        trendBaselineRef.current = {
          previousScore: nextTrend.previousScore,
          previousTabCount: nextTrend.tabsDelta === null ? null : nextStats.totalTabs - nextTrend.tabsDelta,
          bestScore: nextTrend.bestScore,
          checkInStreak: nextTrend.checkInStreak,
        };
        setTrend(nextTrend);
      } else if (trendBaselineRef.current) {
        setTrend(deriveLiveTrend(nextStats, trendBaselineRef.current));
      }
    } catch (error) {
      if (generation === refreshGenerationRef.current) {
        console.error('Failed to calculate Tab Chaos Score:', error);
      }
    } finally {
      if (generation === refreshGenerationRef.current) setIsLoading(false);
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
    browser.tabs.onDetached?.addListener(scheduleRefresh);
    browser.tabs.onAttached?.addListener(scheduleRefresh);
    browser.tabs.onActivated.addListener(scheduleRefresh);
    browser.windows.onFocusChanged.addListener(scheduleRefresh);
    browser.tabGroups?.onCreated.addListener(scheduleRefresh);
    browser.tabGroups?.onUpdated.addListener(scheduleRefresh);
    browser.tabGroups?.onRemoved.addListener(scheduleRefresh);
    return () => {
      refreshGenerationRef.current += 1;
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      browser.tabs.onCreated.removeListener(scheduleRefresh);
      browser.tabs.onRemoved.removeListener(scheduleRefresh);
      browser.tabs.onUpdated.removeListener(scheduleRefresh);
      browser.tabs.onMoved.removeListener(scheduleRefresh);
      browser.tabs.onDetached?.removeListener(scheduleRefresh);
      browser.tabs.onAttached?.removeListener(scheduleRefresh);
      browser.tabs.onActivated.removeListener(scheduleRefresh);
      browser.windows.onFocusChanged.removeListener(scheduleRefresh);
      browser.tabGroups?.onCreated.removeListener(scheduleRefresh);
      browser.tabGroups?.onUpdated.removeListener(scheduleRefresh);
      browser.tabGroups?.onRemoved.removeListener(scheduleRefresh);
    };
  }, [refresh, scheduleRefresh]);

  return { stats, trend, isLoading };
}
