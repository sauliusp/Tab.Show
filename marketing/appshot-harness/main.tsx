import React from 'react';
import ReactDOM from 'react-dom/client';
import { createMockBrowser } from './mockBrowser';
import '../../entrypoints/sidepanel/style.css';
import '../../entrypoints/sidepanel/App.css';
import './style.css';

declare global {
  var browser: ReturnType<typeof createMockBrowser>;
}

const params = new URLSearchParams(window.location.search);
const scenario = params.get('scenario') ?? 'preview';
const allWindows = scenario === 'windows';

window.localStorage.setItem('tab.show.userSettings', JSON.stringify({
  colorPairingId: 'charcoal-violet-amber',
  hoverPreviewDelayMs: 0,
  allWindows,
}));
globalThis.browser = createMockBrowser();
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

  await new Promise(resolve => setTimeout(resolve, 650));
  document.documentElement.dataset.ready = 'true';
}

void prepareScenario();
