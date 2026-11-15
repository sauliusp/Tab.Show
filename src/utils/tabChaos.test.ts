import { describe, expect, it, vi } from 'vitest';
import { calculateTabChaos, getChaosTrendMessage } from './tabChaos';
import type { Tab } from '../types/Tab';

const DAY = 24 * 60 * 60 * 1000;

describe('calculateTabChaos', () => {
  it('combines volume, windows, duplicates, neglected tabs, and grouping into an explainable score', () => {
    const now = Date.UTC(2026, 7, 31, 12);
    const tabs: Tab[] = Array.from({ length: 16 }, (_, index) => ({
      id: index + 1,
      windowId: index < 10 ? 1 : 2,
      index: index < 10 ? index : index - 10,
      active: index === 4,
      title: `Tab ${index + 1}`,
      url: index < 2 ? 'https://duplicate.example/path#section' : `https://domain${index % 4}.example/page/${index}`,
      lastAccessed: now - (index < 8 ? 10 * DAY : DAY),
      groupId: index >= 12 ? 7 : -1,
      discarded: index === 9,
    }));

    const result = calculateTabChaos(tabs, [{ id: 7, title: 'Project', color: 'blue', windowId: 2 }], {
      currentWindowId: 1,
      currentTabId: 5,
      now,
    });

    expect(result.score).toBeGreaterThanOrEqual(35);
    expect(result.factors.map(factor => factor.id)).toEqual(['volume', 'windows', 'duplicates', 'stale', 'ungrouped']);
    expect(result.duplicateTabs).toBe(1);
    expect(result.duplicateSets).toBe(1);
    expect(result.staleTabs).toBe(8);
    expect(result.windowsCount).toBe(2);
    expect(result.groupCount).toBe(1);
    expect(result.currentPosition).toEqual({ position: 5, total: 10 });
    expect(result.quickWin.title).toBe('Close 1 duplicate tab');
    expect(result.topDomains[0]).toEqual({ domain: 'domain2.example', count: 4 });
    expect(result.leastRecentTab?.daysAgo).toBe(10);
  });

  it('keeps a genuinely small session calm', () => {
    const tabs: Tab[] = Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      windowId: 1,
      index,
      url: `https://example${index}.com`,
    }));
    const result = calculateTabChaos(tabs, [], { currentWindowId: 1, currentTabId: 1, now: 1000 });
    expect(result.score).toBe(0);
    expect(result.level).toBe('Clear skies');
    expect(result.quickWin.title).toBe('Keep finding, not tidying');
  });

  it('labels Chrome internal pages as Chrome instead of internal component names', () => {
    const now = Date.UTC(2026, 7, 31, 12);
    const result = calculateTabChaos([
      { id: 1, windowId: 1, index: 0, url: 'chrome://settings', title: 'Settings', lastAccessed: now - DAY },
      { id: 2, windowId: 1, index: 1, url: 'chrome://extensions', title: 'Extensions', lastAccessed: now - (2 * DAY) },
      { id: 3, windowId: 1, index: 2, url: 'chrome-extension://example-id/panel.html', title: 'Extension', lastAccessed: now },
    ], [], { now, currentWindowId: 1, currentTabId: 1 });

    expect(result.topDomains).toContainEqual({ domain: 'Chrome', count: 2 });
    expect(result.topDomains).toContainEqual({ domain: 'Chrome extension', count: 1 });
    expect(result.leastRecentTab?.domain).toBe('Chrome');
  });

  it('keeps complete English messages when a browser locale has no translated entry', () => {
    vi.stubGlobal('browser', {
      i18n: { getMessage: (key: string) => key === 'panelLocale' ? 'zh_CN' : '' },
    });
    const result = calculateTabChaos([{ id: 1, windowId: 1, index: 0 }], [], { now: 1000 });

    expect(result.summary).toBe('1 tab across 1 window.');
    expect(result.factors.find(factor => factor.id === 'volume')?.detail).toBe('1 open tab');
    expect(result.factors.find(factor => factor.id === 'duplicates')?.detail).toBe('0 extra copies');
    expect(getChaosTrendMessage(-1)).toBe('Down 1 point since your last check.');
    expect(getChaosTrendMessage(2)).toBe('Up 2 points since your last check.');
  });

  it('uses localized full messages and formatted numbers without translating page data', () => {
    const getMessage = vi.fn((key: string, substitutions?: string[]) => {
      if (key === 'panelLocale') return 'de';
      if (key === 'services_chaos_detail_volume_other') return `Tabs: ${substitutions?.[0]}`;
      if (key === 'services_chaos_quick_duplicates_title_other') return `${substitutions?.[0]} Duplikate schließen`;
      if (key === 'services_chaos_level_maximum') return 'Viele offene Tabs';
      return '';
    });
    vi.stubGlobal('browser', { i18n: { getMessage } });
    const tabs = Array.from({ length: 1235 }, (_, index) => ({
      id: index + 1, windowId: 1, index, title: '研究资料 $1', url: 'https://research.example/page', lastAccessed: index,
    }));
    const result = calculateTabChaos(tabs, [], { now: 8 * DAY });

    expect(result.factors.find(factor => factor.id === 'volume')?.detail).toBe('Tabs: 1.235');
    expect(result.quickWin.title).toBe('1.234 Duplikate schließen');
    expect(result.level).toBe('Viele offene Tabs');
    expect(result.leastRecentTab?.title).toBe('研究资料 $1');
    expect(result.leastRecentTab?.domain).toBe('research.example');
    expect(getMessage.mock.calls.every(([key]) => !key.includes('研究资料'))).toBe(true);
  });
});
