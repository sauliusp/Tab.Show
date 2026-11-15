import React from 'react';
import ReactDOM from 'react-dom/client';
import { createMockBrowser } from './mockBrowser';
import { getColorPairingById } from '../../src/constants/colorPairings';
import '../../entrypoints/sidepanel/style.css';
import '../../entrypoints/sidepanel/App.css';
import './style.css';

declare global {
  var browser: ReturnType<typeof createMockBrowser>;
}

const params = new URLSearchParams(window.location.search);
const scenario = params.get('scenario') ?? 'preview';
const allWindows = scenario === 'windows' || scenario === 'large' || params.get('allWindows') === 'true';
const tabCount = Math.max(1, Number(params.get('count')) || 12);
const appearanceMode = params.get('appearance') === 'dark' ? 'dark' : params.get('appearance') === 'system' ? 'system' : 'light';
const colorPairingId = getColorPairingById(params.get('palette') ?? '').id;
const requestedPreviewDelay = Number(params.get('previewDelay'));
const hoverPreviewDelayMs = Number.isFinite(requestedPreviewDelay)
  ? Math.max(0, Math.min(1000, requestedPreviewDelay))
  : 0;

window.localStorage.setItem('tab.show.userSettings', JSON.stringify({
  colorPairingId,
  hoverPreviewDelayMs,
  allWindows,
  appearanceMode,
  keepPanelOpen: params.get('keepPanelOpen') === 'true',
  hoverPreviewEnabled: params.get('hover') !== 'false',
}));
window.localStorage.removeItem('tab.show.chaosHistory.v1');
if (scenario === 'chaos') {
  const timestamp = Date.now() - 86_400_000;
  const date = new Date(timestamp);
  const day = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  window.localStorage.setItem('tab.show.chaosHistory.v1', JSON.stringify({
    observations: [{ timestamp, day, score: 94, tabCount: 172 }],
    bestScore: 46,
  }));
}
const requestedLocale = params.get('locale') ?? 'en';
const locale = ['en', 'de', 'zh_CN', 'zh_TW'].includes(requestedLocale) ? requestedLocale : 'en';
const catalogResponse = await fetch(`/public/_locales/${locale}/messages.json`);
if (!catalogResponse.ok) throw new Error(`Missing preview catalog: ${locale}`);
const catalog = await catalogResponse.json();
globalThis.browser = createMockBrowser(tabCount, catalog);
document.documentElement.dataset.scenario = scenario;

const [{ default: App }, { UserSettingsProvider }, { ColorSchemeProvider }] = await Promise.all([
  import('../../entrypoints/sidepanel/App'),
  import('../../src/contexts/UserSettingsContext'),
  import('../../src/contexts/ColorSchemeContext'),
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserSettingsProvider>
    <ColorSchemeProvider>
      <App />
    </ColorSchemeProvider>
  </UserSettingsProvider>,
);

async function waitFor(selector: string, timeout = 5000): Promise<Element> {
  const started = performance.now();
  while (performance.now() - started < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await new Promise(resolve => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out waiting for ${selector}`);
}

async function prepareScenario() {
  const { t } = await import('../../src/i18n');
  const search = await waitFor(`input[aria-label="${t('panelSearch')}"]`) as HTMLInputElement;
  await new Promise(resolve => setTimeout(resolve, 350));

  if (scenario === 'preview') {
    const target = [...document.querySelectorAll('[title]')].find(element => element.getAttribute('title')?.includes('figma.com/design/tabshow-2'));
    document.documentElement.dataset.qaHoverAt = String(performance.now());
    target?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    target?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  }

  if (scenario === 'search' || scenario === 'keyboard' || scenario === 'windows') {
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    const query = scenario === 'windows' ? 'website' : 'TabShow';
    valueSetter?.call(search, query);
    search.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: query }));
    search.dispatchEvent(new Event('change', { bubbles: true }));
    if (scenario === 'keyboard') {
      await new Promise(resolve => setTimeout(resolve, 350));
      search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    }
  }

  if (scenario === 'context') {
    const sort = await waitFor(`[aria-label="${t('panelSortTabs')}"]`);
    sort.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }

  if (scenario === 'settings') {
    const settings = await waitFor(`button[aria-label="${t('panelOpenSettings')}"]`);
    settings.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  if (scenario === 'chaos') {
    const chaos = await waitFor('[data-testid="chaos-score-content"]');
    chaos.closest('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  await new Promise(resolve => setTimeout(resolve, 650));
  document.documentElement.dataset.ready = 'true';
}

void prepareScenario();
