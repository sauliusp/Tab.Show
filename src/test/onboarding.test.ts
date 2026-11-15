import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import pageMessages from '../i18n/pages-en.json';

const root = resolve(import.meta.dirname, '../..');
const script = readFileSync(resolve(root, 'public/pages/onboarding.js'), 'utf8');
type Message = { message: string; placeholders?: Record<string, { content: string }> };
const catalog: Record<string, Message> = pageMessages;

function loadPage(name: 'welcome' | 'whats-new' = 'welcome') {
  const html = readFileSync(resolve(root, `public/pages/${name}/index.html`), 'utf8');
  const page = new DOMParser().parseFromString(html, 'text/html');
  document.head.replaceChildren(...Array.from(page.head.childNodes));
  document.body.replaceChildren(...Array.from(page.body.childNodes));
  document.documentElement.lang = 'en';
  document.documentElement.removeAttribute('dir');
}

function mockMessages(overrides: Record<string, Message> = {}) {
  return vi.fn((key: string, substitutions: string[] = []) => {
    const entry = overrides[key] ?? catalog[key];
    if (!entry) return '';
    return entry.message.replace(/\$([a-z0-9_]+)\$/gi, (_, name: string) => {
      const placeholder = entry.placeholders?.[name];
      return placeholder?.content.replace(/\$(\d+)/g, (_match, index: string) => substitutions[Number(index) - 1] ?? '') ?? '';
    });
  });
}

function start(chrome: Record<string, unknown> = { i18n: { getMessage: mockMessages() } }) {
  vi.stubGlobal('chrome', chrome);
  // Execute the exact standalone script shipped in both extension pages.
  new Function(script)();
}

afterEach(() => {
  vi.useRealTimers();
  document.head.replaceChildren();
  document.body.replaceChildren();
});

describe.each(['welcome', 'whats-new'] as const)('%s localization', (name) => {
  it('covers readable page copy and accessibility text with available English messages', () => {
    loadPage(name);
    for (const node of Array.from(document.querySelectorAll('*'))) {
      for (const attribute of Array.from(node.attributes)) {
        if (['data-i18n', 'data-i18n-aria-label', 'data-i18n-alt'].includes(attribute.name)) {
          expect(catalog[attribute.value], attribute.value).toBeDefined();
        }
      }
      if (node.hasAttribute('aria-label')) expect(node.hasAttribute('data-i18n-aria-label')).toBe(true);
      if (node.getAttribute('alt')) expect(node.hasAttribute('data-i18n-alt')).toBe(true);
    }

    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent?.trim() ?? '';
      const parent = walker.currentNode.parentElement;
      if (!/[a-z]/i.test(text) || parent?.closest('[data-i18n], kbd, script')) continue;
      expect(['TabShow', 'Mac', 'Windows / Linux', 'chrome://extensions/shortcuts'], text).toContain(text);
    }
  });

  it('preserves English content, formatting and actions with and without the i18n API', () => {
    loadPage(name);
    const before = document.body.textContent?.replace(/\s+/g, ' ').trim();
    const keys = document.querySelectorAll('kbd').length;
    const emphasis = document.querySelectorAll('strong').length;
    start();
    expect(document.body.textContent?.replace(/\s+/g, ' ').trim()).toBe(before);
    expect(document.querySelectorAll('kbd')).toHaveLength(keys);
    expect(document.querySelectorAll('strong')).toHaveLength(emphasis);
    expect(document.querySelectorAll('[data-open-panel]').length).toBeGreaterThan(0);

    loadPage(name);
    start({});
    expect(document.body.textContent?.replace(/\s+/g, ' ').trim()).toBe(before);
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('renders the complete German catalog with its inline cues and no unresolved placeholders', () => {
    loadPage(name);
    const german = JSON.parse(readFileSync(resolve(root, 'public/_locales/de/messages.json'), 'utf8')) as Record<string, Message>;
    const numberOfKeys = document.querySelectorAll('kbd').length;
    const numberOfEmphasizedPhrases = document.querySelectorAll('strong').length;
    start({ i18n: { getMessage: mockMessages(german) } });

    expect(document.documentElement.lang).toBe('de');
    expect(document.querySelectorAll('kbd')).toHaveLength(numberOfKeys);
    expect(document.querySelectorAll('strong')).toHaveLength(numberOfEmphasizedPhrases);
    expect(document.body.textContent).not.toMatch(/\$[a-z0-9_]+\$|\uE000|\uE001/i);
    expect(document.querySelector('[data-i18n="pagesLanguages"]')?.textContent).toContain('Chrome-Oberfläche');
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(node => {
      expect(node.textContent?.trim(), node.dataset.i18n).not.toBe('');
    });
  });
});

describe('localized onboarding interactions', () => {
  it.each([
    ['en', 'tabshow-panel-2.4.png'],
    ['de', 'tabshow-panel-2.4-de.png'],
    ['zh-CN', 'tabshow-panel-2.4-zh_CN.png'],
    ['zh-TW', 'tabshow-panel-2.4-zh_TW.png'],
    ['fr', 'tabshow-panel-2.4.png'],
    ['../../outside', 'tabshow-panel-2.4.png'],
    ['constructor', 'tabshow-panel-2.4.png'],
  ])('selects a known local screenshot for the resolved %s catalog', (locale, filename) => {
    loadPage();
    start({ i18n: { getMessage: mockMessages({
      panelLocale: { message: locale },
      pagesWelcomeImageAlt: { message: 'Localized image description' },
    }) } });

    const image = document.querySelector<HTMLImageElement>('[data-localized-panel-image]');
    expect(image?.getAttribute('src')).toBe(`../assets/${filename}`);
    expect(image?.alt).toBe('Localized image description');
  });

  it('falls back to the English screenshot if the localized file cannot load, without retrying indefinitely', () => {
    loadPage();
    start({ i18n: { getMessage: mockMessages({ panelLocale: { message: 'de' } }) } });
    const image = document.querySelector<HTMLImageElement>('[data-localized-panel-image]');
    expect(image?.getAttribute('src')).toBe('../assets/tabshow-panel-2.4-de.png');
    image?.dispatchEvent(new Event('error'));
    expect(image?.getAttribute('src')).toBe('../assets/tabshow-panel-2.4.png');
    const fallback = image?.getAttribute('src');
    const sourceSetter = image ? vi.spyOn(image, 'src', 'set') : undefined;
    image?.dispatchEvent(new Event('error'));
    expect(image?.getAttribute('src')).toBe(fallback);
    expect(sourceSetter).not.toHaveBeenCalled();
  });

  it('reorders complete translated sentences safely while preserving keyboard keys and emphasis', () => {
    loadPage();
    const getMessage = mockMessages({
      panelLocale: { message: 'de' },
      panelDirection: { message: 'ltr' },
      pagesWelcomeTitle: { message: 'Willkommen bei TabShow' },
      pagesWelcomeStepChoosePart1: { message: 'Einstellungen → Seitenleiste geöffnet lassen' },
      pagesWelcomeStepChoose: {
        message: '$part1$: <img src=x onerror=alert(1)> als Text.',
        placeholders: pageMessages.pagesWelcomeStepChoose.placeholders,
      },
      pagesWelcomeSearch: {
        message: '$part3$ wählt aus. $part2$ und $part1$ wechseln die Auswahl.',
        placeholders: pageMessages.pagesWelcomeSearch.placeholders,
      },
      pagesWelcomeImageAlt: { message: 'Die TabShow-Seitenleiste' },
    });
    start({ i18n: { getMessage } });

    expect(document.title).toBe('Willkommen bei TabShow');
    expect(document.documentElement.lang).toBe('de');
    const paragraph = document.querySelector('[data-i18n="pagesWelcomeStepChoose"]');
    expect(paragraph?.textContent).toBe('Einstellungen → Seitenleiste geöffnet lassen: <img src=x onerror=alert(1)> als Text.');
    expect(paragraph?.querySelector('strong')?.textContent).toBe('Einstellungen → Seitenleiste geöffnet lassen');
    expect(paragraph?.querySelector('img')).toBeNull();
    expect(Array.from(document.querySelectorAll('[data-i18n="pagesWelcomeSearch"] kbd')).map(key => key.textContent)).toEqual(['Enter', '↓', '↑']);
    expect(document.querySelector('.product-shot img')?.getAttribute('alt')).toBe('Die TabShow-Seitenleiste');
  });

  it.each(['Missing keys', '$part1$ $part1$ $part2$ $part3$'])('keeps usable fallback text when a translation loses or duplicates inline placeholders: %s', (message) => {
    loadPage();
    const before = document.querySelector('[data-i18n="pagesWelcomeSearch"]')?.textContent;
    start({ i18n: { getMessage: mockMessages({ pagesWelcomeSearch: { message, placeholders: pageMessages.pagesWelcomeSearch.placeholders } }) } });
    expect(document.querySelector('[data-i18n="pagesWelcomeSearch"]')?.textContent).toBe(before);
  });

  it('opens the current window panel only after a click and announces translated success', async () => {
    loadPage();
    const getCurrent = vi.fn().mockResolvedValue({ id: 14 });
    const open = vi.fn().mockResolvedValue(undefined);
    start({
      i18n: { getMessage: mockMessages({ pagesPanelOpened: { message: 'TabShow ist geöffnet.' } }) },
      windows: { getCurrent }, sidePanel: { open },
    });
    expect(getCurrent).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();

    document.querySelector<HTMLButtonElement>('[data-open-panel]')?.click();
    await vi.waitFor(() => expect(document.querySelector('[data-panel-status]')?.textContent).toBe('TabShow ist geöffnet.'));
    expect(open).toHaveBeenCalledWith({ windowId: 14 });
    expect(document.querySelector('[data-panel-status]')?.getAttribute('role')).toBe('status');
  });

  it('provides the actual platform shortcut in localized panel-open failure feedback', async () => {
    loadPage();
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    start({ i18n: { getMessage: mockMessages({
      pagesPanelOpenFallback: { message: 'Mit $shortcut$ öffnen.', placeholders: pageMessages.pagesPanelOpenFallback.placeholders },
    }) } });
    document.querySelector<HTMLButtonElement>('[data-open-panel]')?.click();
    expect(document.querySelector('[data-panel-status]')?.textContent).toBe('Mit Command + Shift + X öffnen.');
  });

  it('copies the Chrome address and resets translated feedback', async () => {
    vi.useFakeTimers();
    loadPage();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText }, platform: 'Linux', userAgent: '' });
    start({ i18n: { getMessage: mockMessages({ pagesCopy: { message: 'Kopieren' }, pagesCopied: { message: 'Kopiert' } }) } });
    document.querySelector<HTMLButtonElement>('[data-copy-shortcuts]')?.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledWith('chrome://extensions/shortcuts');
    expect(document.querySelector('[data-copy-label]')?.textContent).toBe('Kopiert');
    await vi.advanceTimersByTimeAsync(1800);
    expect(document.querySelector('[data-copy-label]')?.textContent).toBe('Kopieren');
  });

  it('selects the address and announces translated feedback when clipboard permission is unavailable', async () => {
    loadPage();
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Unavailable')) }, platform: 'Linux', userAgent: '' });
    start({ i18n: { getMessage: mockMessages({ pagesSelected: { message: 'Ausgewählt' } }) } });
    document.querySelector<HTMLButtonElement>('[data-copy-shortcuts]')?.click();
    await vi.waitFor(() => expect(document.querySelector('[data-copy-label]')?.textContent).toBe('Ausgewählt'));
    expect(window.getSelection()?.toString()).toBe('chrome://extensions/shortcuts');
  });
});
