import type { Tab, TabSortMode } from '../types/Tab';

export function getTabDomain(tab: Tab): string {
  try {
    return new URL(tab.url ?? '').hostname.replace(/^www\./, '');
  } catch {
    return tab.url ?? '';
  }
}

export function getDuplicateKey(tab: Tab): string {
  const rawUrl = tab.url ?? '';
  if (!rawUrl) return '';
  try {
    const url = new URL(rawUrl);
    url.hostname = url.hostname.replace(/^www\./i, '');
    url.hash = '';
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/$/, '');
    return url.toString();
  } catch {
    return rawUrl.replace(/#[\s\S]*$/, '').replace(/\/$/, '');
  }
}

export function getDuplicateCounts(tabs: Tab[]): Map<string, number> {
  const counts = new Map<string, number>();
  tabs.forEach((tab) => {
    const key = getDuplicateKey(tab);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
}

interface SelectTabsOptions {
  query: string;
  sortMode: TabSortMode;
  currentWindowId: number | null;
}

export function selectTabs(tabs: Tab[], { query, sortMode, currentWindowId }: SelectTabsOptions): Tab[] {
  const needle = query.trim().toLocaleLowerCase();
  return tabs
    .filter((tab) => !needle || `${tab.title ?? ''} ${tab.url ?? ''}`.toLocaleLowerCase().includes(needle))
    .sort((a, b) => {
      const aCurrent = a.windowId === currentWindowId;
      const bCurrent = b.windowId === currentWindowId;
      if (aCurrent !== bCurrent) return aCurrent ? -1 : 1;
      if (sortMode === 'recently-used') return (b.lastAccessed ?? 0) - (a.lastAccessed ?? 0) || compareCurrentOrder(a, b);
      if (sortMode === 'recently-opened') return (b.id ?? 0) - (a.id ?? 0) || compareCurrentOrder(a, b);
      if (sortMode === 'domain') return getTabDomain(a).localeCompare(getTabDomain(b)) || compareCurrentOrder(a, b);
      if (sortMode === 'group') return (a.groupId ?? -1) - (b.groupId ?? -1) || compareCurrentOrder(a, b);
      return compareCurrentOrder(a, b);
    });
}

function compareCurrentOrder(a: Tab, b: Tab): number {
  return (a.index ?? 0) - (b.index ?? 0) || (a.id ?? 0) - (b.id ?? 0);
}
