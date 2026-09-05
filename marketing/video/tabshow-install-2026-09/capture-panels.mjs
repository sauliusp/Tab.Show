import { chromium } from '/Users/spetreikis/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from '../../../node_modules/vite/dist/node/index.js';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// Authentic production React UI rendered by the existing appshot harness.
// No production source or original marketing assets are changed.
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const output = path.join(here, 'assets/panels');
await mkdir(output, { recursive: true });
const server = await createServer({
  configFile: false,
  root: path.join(root, 'marketing/appshot-harness'),
  server: { host: '127.0.0.1', port: 0, fs: { allow: [root] } },
  esbuild: { jsx: 'automatic' },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
});
await server.listen();
const port = server.httpServer.address().port;
const baseUrl = `http://127.0.0.1:${port}/`;
const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage({ viewport: { width: 420, height: 650 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => {
  const OriginalDate = Date;
  const fixed = OriginalDate.parse('2026-09-05T08:00:00.000Z');
  globalThis.Date = class extends OriginalDate {
    constructor(...args) { super(...(args.length ? args : [fixed])); }
    static now() { return fixed; }
  };
});
const manifest = {
  version: '2.1.0',
  provenance: 'Production entrypoints/sidepanel/App.tsx and src/components/TabItem.tsx, rendered through existing marketing/appshot-harness with its deterministic 12-tab mockBrowser fixture.',
  viewportCss: { width: 420, height: 650 },
  deviceScaleFactor: 2,
  imagePixels: { width: 840, height: 1300 },
  colorPairing: 'charcoal-violet-amber',
  productionBehavior: 'Hover previews current-window tabs. Leaving the side panel restores the original tab. Click or Enter commits the selected tab and requests the side panel to close. Other-window rows only switch on click or Enter.',
  captures: {},
  assertions: [],
};
async function open(scenario = 'idle') {
  await page.goto(`${baseUrl}?scenario=${scenario}&previewDelay=0&palette=charcoal-violet-amber`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(-10, -10);
  await page.evaluate(() => {
    const oldClose = globalThis.browser.sidePanel.close;
    globalThis.browser.qa.closeRequests = 0;
    globalThis.browser.sidePanel.close = async (...args) => {
      globalThis.browser.qa.closeRequests += 1;
      return oldClose(...args);
    };
  });
}
async function activeId() {
  return page.evaluate(async () => (await globalThis.browser.tabs.query({ active: true }))[0]?.id);
}
async function capture(name, extra = {}) {
  await page.waitForTimeout(260);
  const state = await page.evaluate(async () => {
    const rect = element => {
      if (!element) return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height, center: { x: x + width / 2, y: y + height / 2 } };
    };
    const rows = [...document.querySelectorAll('[id^="tab-option-"]')].map(element => ({
      id: Number(element.id.replace('tab-option-', '')),
      text: element.textContent.trim(),
      title: element.getAttribute('title'),
      bounds: rect(element),
      backgroundColor: getComputedStyle(element).backgroundColor,
      borderColor: getComputedStyle(element).borderColor,
      selected: element.getAttribute('aria-current') === 'true',
      hovered: element.matches(':hover'),
      visibleInPanel: element.getBoundingClientRect().top < 610 && element.getBoundingClientRect().bottom > 190,
      clickTarget: rect(element),
      safeClickPoint: { x: element.getBoundingClientRect().x + 140, y: element.getBoundingClientRect().y + element.getBoundingClientRect().height / 2 },
    }));
    const input = document.querySelector('input[aria-label="Search tabs"]');
    return {
      query: input.value,
      activeTabId: (await globalThis.browser.tabs.query({ active: true }))[0]?.id,
      activeDescendant: input.getAttribute('aria-activedescendant'),
      searchInput: rect(input),
      searchField: rect(input.closest('.MuiOutlinedInput-root')),
      currentWindowButton: rect(document.querySelector('[aria-label="Current window"]')),
      allWindowsButton: rect(document.querySelector('[aria-label="All windows"]')),
      allWindows: document.querySelector('[aria-label="All windows"]').getAttribute('aria-pressed') === 'true',
      rows,
      updates: [...globalThis.browser.qa.updates],
      closeRequests: globalThis.browser.qa.closeRequests,
      tabCountSummary: document.querySelector('[data-testid="tab-count-summary"]').textContent,
    };
  });
  await page.screenshot({ path: path.join(output, `${name}.png`), type: 'png', animations: 'disabled', caret: 'hide' });
  manifest.captures[name] = { file: `${name}.png`, ...state, ...extra };
  return state;
}
try {
  await open();
  assert.equal(await activeId(), 101);
  await capture('idle-current');
  await page.locator('#tab-option-102').hover();
  await page.waitForFunction(() => document.documentElement.dataset.qaLastUpdateId === '102');
  assert.equal(await activeId(), 102);
  const hovered = await capture('hover-design');
  assert.equal(hovered.rows.find(row => row.id === 102).backgroundColor, 'rgb(244, 162, 89)');
  assert.equal(hovered.rows.find(row => row.id === 101).backgroundColor, 'rgb(44, 42, 74)');
  await page.mouse.move(-10, 310);
  await page.waitForFunction(() => document.documentElement.dataset.qaLastUpdateId === '101');
  assert.equal(await activeId(), 101);
  const restored = await capture('returned-current');
  assert.equal(restored.rows.find(row => row.id === 102).backgroundColor, 'rgba(44, 42, 74, 0.1)');
  assert.equal(restored.rows.find(row => row.id === 101).backgroundColor, 'rgb(44, 42, 74)');
  manifest.assertions.push({ action: 'Hover tab 102, then leave side panel', activeIds: [101, 102, 101], passed: true });
  await page.locator('#tab-option-102').click({ position: { x: 140, y: 25 } });
  await page.waitForFunction(() => globalThis.browser.qa.closeRequests === 1);
  await page.mouse.move(-10, 310);
  assert.equal(await activeId(), 102);
  const committed = await capture('committed-design', { caution: 'The mock keeps the panel visible after close(); production closes it. Use this still only for an internal transition.' });
  assert.equal(committed.rows.find(row => row.id === 102).backgroundColor, 'rgb(44, 42, 74)');
  manifest.assertions.push({ action: 'Click tab 102 commits and requests panel close; leaving panel no longer restores 101', activeId: 102, closeRequests: committed.closeRequests, passed: true });

  await open('windows');
  await capture('idle-all-windows');
  const input = page.getByRole('textbox', { name: 'Search tabs' });
  await input.fill('TabShow');
  await capture('search-tabshow');
  await input.fill('website');
  const website = await capture('search-website');
  assert.deepEqual(website.rows.map(row => row.id), [104, 202]);
  await input.press('ArrowDown');
  const keyboard = await capture('keyboard-website');
  assert.equal(keyboard.activeDescendant, 'tab-option-202');
  assert.equal(keyboard.activeTabId, 101);
  manifest.assertions.push({ action: 'All-window website search finds one current-window tab and one other-window tab; ArrowDown highlights other-window result without preview activation', resultIds: [104, 202], highlightedId: 202, activeId: 101, passed: true });
  await input.press('Enter');
  await page.waitForFunction(() => globalThis.browser.qa.closeRequests === 1);
  assert.equal(await activeId(), 202);
  manifest.assertions.push({ action: 'Enter on keyboard-selected other-window result commits tab 202 and requests panel close', activeId: 202, closeRequests: 1, passed: true });
  assert.deepEqual(errors, []);
  manifest.pageErrors = errors;
  await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ output, captures: Object.keys(manifest.captures), assertions: manifest.assertions }, null, 2));
} finally {
  await browser.close();
  await server.close();
}
