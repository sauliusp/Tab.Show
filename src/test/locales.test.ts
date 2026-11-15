import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import panel from '../i18n/panel-en.json';
import services from '../i18n/services-en.json';
import pages from '../i18n/pages-en.json';

type Message = { message: string; placeholders?: Record<string, { content: string }> };
const root = resolve(import.meta.dirname, '../..');
const english: Record<string, Message> = { ...panel, ...services, ...pages };
const readCatalog = (locale: string): Record<string, Message> => JSON.parse(readFileSync(resolve(root, `public/_locales/${locale}/messages.json`), 'utf8'));

describe('packaged localization contracts', () => {
  it('ships the same English catalog used for runtime fallback', () => {
    expect(readCatalog('en')).toEqual(english);
    expect(Object.keys(english)).toHaveLength(Object.keys(panel).length + Object.keys(services).length + Object.keys(pages).length);
  });

  it.each(['en', 'de', 'zh_CN', 'zh_TW'])('%s covers every message and preserves native substitution contracts', (locale) => {
    const catalog = readCatalog(locale);
    expect(Object.keys(catalog).sort()).toEqual(Object.keys(english).sort());
    for (const [key, source] of Object.entries(english)) {
      const translated = catalog[key];
      if (!translated) throw new Error(`Missing ${locale} message: ${key}`);
      expect(translated.message.trim(), key).not.toBe('');
      expect(translated.message, key).not.toMatch(/\u2014|__MSG_|TODO|TRANSLATE/);
      const names = (message: string) => [...message.replace(/\$\$/g, '').matchAll(/\$([a-zA-Z0-9_]+)\$/g)].map(match => match[1]!.toLowerCase()).sort();
      expect(names(translated.message), key).toEqual(names(source.message));
      const content = (entry: Message) => Object.fromEntries(Object.entries(entry.placeholders ?? {}).map(([name, value]) => [name, value.content]));
      expect(content(translated), key).toEqual(content(source));
    }
    expect(catalog.panelLocale!.message).toBe(locale.replace('_', '-'));
    expect(catalog.panelDirection!.message).toBe('ltr');
    expect(catalog.panelExtensionName!.message.length).toBeLessThanOrEqual(75);
    expect(catalog.panelExtensionDescription!.message.length).toBeLessThanOrEqual(132);
  });
});
