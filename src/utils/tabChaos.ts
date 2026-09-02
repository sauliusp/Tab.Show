import { Tab, TabGroup } from '../types/Tab';
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
  level: 'Clear skies' | 'Lively' | 'Busy' | 'Wild' | 'Maximum chaos';
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
  if (score < 20) return { level: 'Clear skies', levelDescription: 'Your browser is calm and easy to scan.' };
  if (score < 40) return { level: 'Lively', levelDescription: 'A few loose ends, but still comfortably under control.' };
  if (score < 60) return { level: 'Busy', levelDescription: 'Search and sorting are earning their keep.' };
  if (score < 80) return { level: 'Wild', levelDescription: 'There is real tab sprawl, but TabShow can still make it navigable.' };
  return { level: 'Maximum chaos', levelDescription: 'This browser session deserves its own weather system.' };
}

function safeDomain(tab: Tab): string {
  if (tab.url?.startsWith('chrome://')) return 'Chrome';
  if (tab.url?.startsWith('chrome-extension://')) return 'Chrome extension';
  const domain = getTabDomain(tab);
  if (domain) return domain;
  return 'Other';
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
        title: leastRecent.title || 'Untitled tab',
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
    { id: 'volume', label: 'Tab volume', points: volumePoints, detail: `${totalTabs} open tab${totalTabs === 1 ? '' : 's'}` },
    { id: 'windows', label: 'Window sprawl', points: windowPoints, detail: `${windowsCount} Chrome window${windowsCount === 1 ? '' : 's'}` },
    { id: 'duplicates', label: 'Duplicates', points: duplicatePoints, detail: `${duplicateTabs} extra cop${duplicateTabs === 1 ? 'y' : 'ies'}` },
    { id: 'stale', label: 'Quiet for 7+ days', points: stalePoints, detail: `${staleTabs} long-neglected tab${staleTabs === 1 ? '' : 's'}` },
    { id: 'ungrouped', label: 'Ungrouped load', points: ungroupedPoints, detail: `${ungroupedTabs} tab${ungroupedTabs === 1 ? '' : 's'} outside groups` },
  ];
  const score = clamp(factors.reduce((total, factor) => total + factor.points, 0), 0, 100);
  const levelInfo = describeLevel(score);

  let summary = `${totalTabs} tabs across ${windowsCount} window${windowsCount === 1 ? '' : 's'}.`;
  let quickWin = { title: 'Keep finding, not tidying', detail: 'Your session is already calm. TabShow will stay out of the way until you need it.' };
  if (duplicateTabs > 0) {
    summary = `${duplicateTabs} duplicate tab${duplicateTabs === 1 ? ' is' : 's are'} the fastest source of avoidable clutter.`;
    quickWin = { title: `Close ${duplicateTabs} duplicate tab${duplicateTabs === 1 ? '' : 's'}`, detail: 'Duplicates are the quickest way to lower the score without reorganizing your workflow.' };
  } else if (staleTabs > 0) {
    summary = `${staleTabs} tab${staleTabs === 1 ? ' has' : 's have'} been quiet for at least a week.`;
    quickWin = { title: 'Sort by recently used', detail: 'The quietest tabs fall to the bottom, making a quick keep-or-close pass much easier.' };
  } else if (windowsCount >= 3) {
    summary = `Your active work is spread across ${windowsCount} Chrome windows.`;
    quickWin = { title: 'Use Current window for focus', detail: 'Keep All windows for retrieval, then narrow the list when you want a calmer project view.' };
  } else if (ungroupedTabs >= 12) {
    summary = `${ungroupedTabs} ungrouped tabs are relying on search and memory for context.`;
    quickWin = { title: 'Try By domain', detail: 'Domain sorting creates instant context without asking you to build a workspace system.' };
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

export function getChaosScoreColor(score: number): string {
  if (score < 20) return '#2E9D72';
  if (score < 40) return '#5E9B55';
  if (score < 60) return '#D19A2A';
  if (score < 80) return '#DF702C';
  return '#D34D5E';
}
