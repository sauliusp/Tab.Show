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
globalThis.browser = createMockBrowser(tabCount);
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
  const search = await waitFor('input[aria-label="Search tabs"]') as HTMLInputElement;
  await new Promise(resolve => setTimeout(resolve, 350));

  if (scenario === 'preview') {
    const target = [...document.querySelectorAll('[title]')].find(element => element.getAttribute('title')?.includes('figma.com/design/tabshow-2'));
    document.documentElement.dataset.qaHoverAt = String(performance.now());
    target?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    target?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  }

  if (scenario === 'search' || scenario === 'keyboard') {
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    valueSetter?.call(search, 'TabShow');
    search.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'TabShow' }));
    search.dispatchEvent(new Event('change', { bubbles: true }));
    if (scenario === 'keyboard') search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  }

  if (scenario === 'context') {
    const sort = await waitFor('[aria-label="Sort tabs"]');
    sort.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }

  if (scenario === 'settings') {
    const settings = await waitFor('button[aria-label="open settings"]');
    settings.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  if (scenario === 'chaos') {
    const chaos = await waitFor('button[aria-label^="Open Tab Chaos Score"]');
    chaos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  await new Promise(resolve => setTimeout(resolve, 650));
  document.documentElement.dataset.ready = 'true';
}

void prepareScenario();
