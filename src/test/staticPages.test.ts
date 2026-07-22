import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '../..');

function loadPage(name: 'welcome' | 'whats-new') {
  const path = resolve(projectRoot, `public/pages/${name}/index.html`);
  const html = readFileSync(path, 'utf8');
  return { path, html, document: new DOMParser().parseFromString(html, 'text/html') };
}

describe.each(['welcome', 'whats-new'] as const)('%s static page', (name) => {
  it('has complete metadata, a single primary heading, and local CSP-safe assets', () => {
    const { path, document } = loadPage(name);

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toMatch(/TabShow/);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('meta[name="viewport"]')).not.toBeNull();
    expect(document.querySelectorAll('script:not([src])')).toHaveLength(0);

    document.querySelectorAll<HTMLLinkElement | HTMLScriptElement>('link[href], script[src]').forEach((asset) => {
      const reference = asset.getAttribute('href') ?? asset.getAttribute('src');
      if (!reference || /^(https?:|data:|#)/.test(reference)) return;
      expect(existsSync(resolve(dirname(path), reference)), `Missing ${reference}`).toBe(true);
    });
  });

  it('keeps the fast-start actions and shortcut guidance discoverable', () => {
    const { document, html } = loadPage(name);

    expect(document.querySelectorAll('[data-open-panel]').length).toBeGreaterThan(0);
    expect(document.querySelector('[data-copy-shortcuts]')).not.toBeNull();
    expect(html).toContain('chrome://extensions/shortcuts');
    expect(html).toContain('Command + Shift + X');
    expect(html).toContain('Ctrl + Shift + X');
    expect(html).toContain('Esc');
  });
});

describe('v2 update page', () => {
  it('announces the actual v2 feature set without invented shortcuts', () => {
    const { html } = loadPage('whats-new');

    expect(html).toContain('Version 2.0');
    expect(html).toContain('Search every open tab');
    expect(html).toContain('All windows');
    expect(html).toContain('Recently used');
    expect(html).toContain('recently added (approx.)');
    expect(html).not.toMatch(/⌘\s*[123]/);
  });
});
