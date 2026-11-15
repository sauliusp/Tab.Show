import type { Tab, TabGroup } from '../types/Tab';
import { plural, t } from '../i18n';
import { getDuplicateKey, getTabDomain } from './tabSelectors';

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_AFTER_MS = 7 * DAY_MS;

export interface ChaosDomain {
  domain: string;
  count: number;
}

export interface ChaosFactor {
  id: 'volume' | 'windows' | 'duplicates' | 'stale' | 'ungrouped';
  label: string;
  points: number;
  detail: string;
}

export interface TabChaosStats {
  score: number;
  level: string;
  levelDescription: string;
  totalTabs: number;
  windowsCount: number;
  duplicateTabs: number;
  duplicateSets: number;
  staleTabs: number;
  sleepingTabs: number;
  groupCount: number;
  groupedTabs: number;
  topDomains: ChaosDomain[];
  leastRecentTab: { title: string; domain: string; daysAgo: number } | null;
  currentPosition: { position: number; total: number } | null;
  factors: ChaosFactor[];
  summary: string;
  quickWin: { title: string; detail: string };
  calculatedAt: number;
}

interface CalculateChaosOptions {
  currentWindowId?: number | null;
  currentTabId?: number | null;
  now?: number;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

function describeLevel(score: number): Pick<TabChaosStats, 'level' | 'levelDescription'> {
  if (score < 20) return { level: t('services_chaos_level_clear'), levelDescription: t('services_chaos_level_clear_description') };
  if (score < 40) return { level: t('services_chaos_level_lively'), levelDescription: t('services_chaos_level_lively_description') };
  if (score < 60) return { level: t('services_chaos_level_busy'), levelDescription: t('services_chaos_level_busy_description') };
  if (score < 80) return { level: t('services_chaos_level_wild'), levelDescription: t('services_chaos_level_wild_description') };
  return { level: t('services_chaos_level_maximum'), levelDescription: t('services_chaos_level_maximum_description') };
}

function safeDomain(tab: Tab): string {
  if (tab.url?.startsWith('chrome://')) return t('services_chaos_domain_browser');
  if (tab.url?.startsWith('chrome-extension://')) return t('services_chaos_domain_extension');
  const domain = getTabDomain(tab);
  if (domain) return domain;
  return t('services_chaos_domain_other');
}

export function calculateTabChaos(tabs: Tab[], groups: TabGroup[], options: CalculateChaosOptions = {}): TabChaosStats {
  const now = options.now ?? Date.now();
  const totalTabs = tabs.length;
  const windowIds = new Set(tabs.map(tab => tab.windowId).filter((id): id is number => typeof id === 'number'));
  const windowsCount = windowIds.size;

  const duplicateCounts = new Map<string, number>();
  tabs.forEach((tab) => {
    const key = getDuplicateKey(tab);
    if (key) duplicateCounts.set(key, (duplicateCounts.get(key) ?? 0) + 1);
  });
  const duplicateSets = [...duplicateCounts.values()].filter(count => count > 1).length;
  const duplicateTabs = [...duplicateCounts.values()].reduce((total, count) => total + Math.max(0, count - 1), 0);

  const staleCandidates = tabs.filter(tab => typeof tab.lastAccessed === 'number' && now - tab.lastAccessed >= STALE_AFTER_MS);
  const staleTabs = staleCandidates.length;
  const sleepingTabs = tabs.filter(tab => tab.discarded).length;
  const groupedTabs = tabs.filter(tab => typeof tab.groupId === 'number' && tab.groupId >= 0).length;
  const visibleGroupIds = new Set(tabs.map(tab => tab.groupId).filter((id): id is number => typeof id === 'number' && id >= 0));
  const groupCount = Math.max(visibleGroupIds.size, groups.filter(group => visibleGroupIds.has(group.id)).length);
  const ungroupedTabs = totalTabs - groupedTabs;

  const domainCounts = new Map<string, number>();
  tabs.forEach((tab) => {
    const domain = safeDomain(tab);
    domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
  });
  const topDomains = [...domainCounts.entries()]
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain))
    .slice(0, 4);

  const leastRecent = tabs
    .filter((tab): tab is Tab & { lastAccessed: number } => typeof tab.lastAccessed === 'number')
    .sort((a, b) => a.lastAccessed - b.lastAccessed)[0];
  const leastRecentTab = leastRecent
    ? {
        title: leastRecent.title || t('services_chaos_untitled_tab'),
        domain: safeDomain(leastRecent),
        daysAgo: Math.max(0, Math.floor((now - leastRecent.lastAccessed) / DAY_MS)),
      }
    : null;

  const currentWindowTabs = tabs
    .filter(tab => options.currentWindowId == null || tab.windowId === options.currentWindowId)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const currentIndex = currentWindowTabs.findIndex(tab => tab.id === options.currentTabId);
  const currentPosition = currentIndex >= 0
    ? { position: currentIndex + 1, total: currentWindowTabs.length }
    : null;

  const volumePoints = totalTabs <= 8
    ? 0
    : Math.round(clamp(Math.log2(totalTabs / 8) / 4, 0, 1) * 42);
  const windowPoints = Math.min(14, Math.max(0, windowsCount - 1) * 4);
  const duplicatePoints = Math.min(18, duplicateTabs * 3);
  const stalePoints = totalTabs === 0 ? 0 : Math.min(16, Math.round((staleTabs / totalTabs) * 24));
  const ungroupedPoints = totalTabs <= 12 ? 0 : Math.min(10, Math.round((ungroupedTabs / totalTabs) * 10));

  const factors: ChaosFactor[] = [
    { id: 'volume', label: t('services_chaos_factor_volume'), points: volumePoints, detail: plural('services_chaos_detail_volume', totalTabs) },
    { id: 'windows', label: t('services_chaos_factor_windows'), points: windowPoints, detail: plural('services_chaos_detail_windows', windowsCount) },
    { id: 'duplicates', label: t('services_chaos_factor_duplicates'), points: duplicatePoints, detail: plural('services_chaos_detail_duplicates', duplicateTabs) },
    { id: 'stale', label: t('services_chaos_factor_stale'), points: stalePoints, detail: plural('services_chaos_detail_stale', staleTabs) },
    { id: 'ungrouped', label: t('services_chaos_factor_ungrouped'), points: ungroupedPoints, detail: plural('services_chaos_detail_ungrouped', ungroupedTabs) },
  ];
  const score = clamp(factors.reduce((total, factor) => total + factor.points, 0), 0, 100);
  const levelInfo = describeLevel(score);

  let summary = plural(windowsCount === 1 ? 'services_chaos_summary_single_window' : 'services_chaos_summary_multiple_windows', totalTabs, { windows: windowsCount });
  let quickWin = { title: t('services_chaos_quick_calm_title'), detail: t('services_chaos_quick_calm_detail') };
  if (duplicateTabs > 0) {
    summary = plural('services_chaos_summary_duplicates', duplicateTabs);
    quickWin = { title: plural('services_chaos_quick_duplicates_title', duplicateTabs), detail: t('services_chaos_quick_duplicates_detail') };
  } else if (staleTabs > 0) {
    summary = plural('services_chaos_summary_stale', staleTabs);
    quickWin = { title: t('services_chaos_quick_stale_title'), detail: t('services_chaos_quick_stale_detail') };
  } else if (windowsCount >= 3) {
    summary = t('services_chaos_summary_windows', { count: windowsCount });
    quickWin = { title: t('services_chaos_quick_windows_title'), detail: t('services_chaos_quick_windows_detail') };
  } else if (ungroupedTabs >= 12) {
    summary = t('services_chaos_summary_ungrouped', { count: ungroupedTabs });
    quickWin = { title: t('services_chaos_quick_ungrouped_title'), detail: t('services_chaos_quick_ungrouped_detail') };
  }

  return {
    score,
    ...levelInfo,
    totalTabs,
    windowsCount,
    duplicateTabs,
    duplicateSets,
    staleTabs,
    sleepingTabs,
    groupCount,
    groupedTabs,
    topDomains,
    leastRecentTab,
    currentPosition,
    factors,
    summary,
    quickWin,
    calculatedAt: now,
  };
}

export function getChaosTrendMessage(scoreDelta: number | null): string {
  if (scoreDelta === null) return t('services_chaos_trend_first');
  if (scoreDelta < 0) return plural('services_chaos_trend_down', Math.abs(scoreDelta));
  if (scoreDelta > 0) return plural('services_chaos_trend_up', scoreDelta);
  return t('services_chaos_trend_steady');
}

export function getChaosScoreColor(score: number): string {
  if (score < 20) return '#2E9D72';
  if (score < 40) return '#5E9B55';
  if (score < 60) return '#D19A2A';
  if (score < 80) return '#DF702C';
  return '#D34D5E';
}
