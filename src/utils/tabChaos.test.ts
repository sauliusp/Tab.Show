import { describe, expect, it } from 'vitest';
import { calculateTabChaos } from './tabChaos';
import { Tab } from '../types/Tab';

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
});
