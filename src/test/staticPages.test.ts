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

    document.querySelectorAll<HTMLLinkElement | HTMLScriptElement | HTMLImageElement>('link[href], script[src], img[src]').forEach((asset) => {
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

describe('release guidance', () => {
  it('uses a current local product capture instead of a simulated welcome panel', () => {
    const { document } = loadPage('welcome');
    const capture = document.querySelector<HTMLImageElement>('.product-shot img');

    expect(capture?.getAttribute('src')).toBe('../assets/tabshow-panel-2.4.png');
    expect(capture?.alt).toMatch(/side panel/i);
    expect(document.querySelectorAll('.fake-tab')).toHaveLength(0);
  });

  it('announces optional behavior with its defaults and preserves earlier release notes', () => {
    const { html, document } = loadPage('whats-new');
    const version = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8')).version;
    const release = version.split('.').slice(0, 2).join('.');

    expect(document.title).toContain(`TabShow ${release}`);
    expect(document.querySelector('.status-update')?.textContent).toBe(`Version ${release}`);
    expect(document.querySelector('.update-hero')?.textContent).toContain('Every feature is free');
    expect(html).toContain('Keep panel open after choosing a tab');
    expect(html).toContain('off by default');
    expect(html).toContain('Preview tabs on hover');
    expect(html).toContain('on by default');
    expect(html).toContain('Hover preview delay');
    expect(html).toContain('Chrome’s pin icon only pins TabShow to the toolbar');
    expect(html).toContain('Version 2.3');
    expect(html).toContain('Version 2.0');
    expect(html).toContain('Tab Chaos Score');
    expect(document.querySelectorAll('iframe')).toHaveLength(0);
    expect(html).not.toMatch(/five stars|5-star|5 star/i);
  });

  it.each(['welcome', 'whats-new'] as const)('keeps %s external links safe and the theme limitation clear', (name) => {
    const { document, html } = loadPage(name);

    document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]').forEach((link) => {
      expect(link.rel.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
      expect(link.getAttribute('href')).toMatch(/^https:\/\//);
    });
    expect(html).toContain('Appearance → System');
    expect(html).toMatch(/custom Chrome theme/i);
  });
});
