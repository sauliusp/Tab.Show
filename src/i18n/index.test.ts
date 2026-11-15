import { describe, expect, it, vi } from 'vitest';
import { formatNumber, getLocale, plural, t } from './index';

function mockMessages(messages: Record<string, string>, locale = 'en') {
  const getMessage = vi.fn((key: string, values: string[] = []) => {
    if (key === 'panelLocale') return locale;
    return (messages[key] ?? '').replace(/\$(\d+)/g, (_match, position: string) => values[Number(position) - 1] ?? '');
  });
  vi.stubGlobal('browser', { i18n: { getMessage } });
  return getMessage;
}

describe('Chrome message helper', () => {
  it('renders English without an extension API and preserves literal user text', () => {
    vi.stubGlobal('browser', undefined);
    expect(t('panelSearch')).toBe('Search tabs');
    expect(t('panelOpenTab', { title: 'Price $1, $count$, $$', address: 'example.test' }))
      .toBe('Open Price $1, $count$, $$, example.test');
    expect(plural('panelDays', 1)).toBe('1 day');
    expect(plural('panelDays', 2)).toBe('2 days');
  });

  it('uses native translations and ordered, locale-formatted substitutions', () => {
    const getMessage = mockMessages({ panelCountsAllWindows: '$2 Fenster; $1 Tabs' }, 'de');
    expect(t('panelCountsAllWindows', { windows: 2, count: 1234 })).toBe('2 Fenster; 1.234 Tabs');
    expect(getMessage).toHaveBeenCalledWith('panelCountsAllWindows', ['1.234', '2']);
    expect(formatNumber(0.25, { minimumFractionDigits: 2 })).toBe('0,25');
  });

  it('uses Chinese plural rules for native text and English rules for missing text', () => {
    mockMessages({ panelDays_other: '$1 天' }, 'zh-CN');
    expect(plural('panelDays', 1)).toBe('1 天');
    mockMessages({}, 'zh-CN');
    expect(plural('panelDays', 1)).toBe('1 day');
    expect(plural('panelDays', 2)).toBe('2 days');
  });

  it('falls back safely when the browser API is absent or throws', () => {
    vi.stubGlobal('browser', { i18n: { getMessage: () => { throw new Error('context unavailable'); } } });
    expect(getLocale()).toBe('en');
    expect(t('panelSearch')).toBe('Search tabs');
  });
});
