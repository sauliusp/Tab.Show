import { describe, expect, it } from 'vitest';
import type { Tab } from '../types/Tab';
import { getDuplicateCounts, getDuplicateKey, getTabDomain, selectTabs } from './tabSelectors';

function makeTabs(count = 150): Tab[] {
  return Array.from({ length: count }, (_, offset) => {
    const id = offset + 1;
    return {
      id,
      index: offset % 70,
      windowId: offset < 70 ? 10 : offset < 100 ? 20 : offset < 125 ? 30 : 40,
      title: offset === 149 ? 'Unicode Žąsis final target' : `Project tab ${String(id).padStart(3, '0')}`,
      url: `https://${offset % 5 === 0 ? 'www.' : ''}domain${offset % 12}.example/path/${id}`,
      groupId: offset % 13 === 0 ? undefined : offset % 12,
      lastAccessed: 1_000_000 - offset * 100,
    };
  });
}

describe('tab selectors at 150-tab scale', () => {
  it('searches title and URL case-insensitively without mutating input', () => {
    const tabs = makeTabs();
    const target = tabs[75];
    expect(target).toBeDefined();
    if (!target) throw new Error('Missing search fixture');
    target.url = 'https://stripe.example/URL-ONLY-Needle';
    const before = tabs.map(tab => tab.id);
    expect(selectTabs(tabs, { query: ' žĄSIS ', sortMode: 'current', currentWindowId: 10 }).map(tab => tab.id)).toEqual([150]);
    expect(selectTabs(tabs, { query: 'url-only-needle', sortMode: 'current', currentWindowId: 10 }).map(tab => tab.id)).toEqual([76]);
    expect(tabs.map(tab => tab.id)).toEqual(before);
  });

  it('keeps the current window first and preserves stable tab order', () => {
    const selected = selectTabs(makeTabs(), { query: '', sortMode: 'current', currentWindowId: 20 });
    expect(selected.slice(0, 30).every(tab => tab.windowId === 20)).toBe(true);
    expect(selected.slice(0, 30).map(tab => tab.index)).toEqual(Array.from({ length: 30 }, (_, i) => i));
  });

  it('supports every sort mode deterministically', () => {
    const tabs = makeTabs();
    for (const sortMode of ['current', 'recently-used', 'recently-opened', 'domain', 'group'] as const) {
      const first = selectTabs(tabs, { query: '', sortMode, currentWindowId: 10 }).map(tab => tab.id);
      const second = selectTabs(tabs, { query: '', sortMode, currentWindowId: 10 }).map(tab => tab.id);
      expect(first).toHaveLength(150);
      expect(second).toEqual(first);
    }
  });

  it('normalizes domains and duplicate URLs safely', () => {
    const tabs = [
      { id: 1, url: 'https://WWW.Example.com:443/path/#one' },
      { id: 2, url: 'https://example.com/path' },
      { id: 3, url: 'not a url/#fragment' },
      { id: 4, url: 'not a url' },
      { id: 5 },
    ] satisfies [Tab, Tab, Tab, Tab, Tab];
    const counts = getDuplicateCounts(tabs);
    expect(getTabDomain(tabs[0])).toBe('example.com');
    expect(getDuplicateKey(tabs[0])).toBe(getDuplicateKey(tabs[1]));
    expect(counts.get(getDuplicateKey(tabs[0]))).toBe(2);
    expect(counts.get(getDuplicateKey(tabs[2]))).toBe(2);
    expect(counts.has('')).toBe(false);
  });
});
