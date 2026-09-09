import { createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { UserSettingsProvider } from '../../src/contexts/UserSettingsContext';
import { ColorSchemeProvider } from '../../src/contexts/ColorSchemeContext';

const event = () => ({ addListener: vi.fn(), removeListener: vi.fn() });

function browserWith150Tabs(includeOtherWindow = false) {
  const tabs = Array.from({ length: 150 }, (_, index) => ({
    id: index + 1,
    windowId: includeOtherWindow && index === 1 ? 20 : 10,
    index,
    active: index === 0,
    title: index === 149 ? 'Final Figma Design' : `QA Tab ${String(index + 1).padStart(3, '0')}`,
    url: index === 149 ? 'https://figma.example/final-target' : `https://domain${index % 10}.example/item/${index + 1}`,
    lastAccessed: 10_000 - index,
    pinned: index % 17 === 0,
    audible: index % 29 === 0,
    discarded: index % 31 === 0,
  }));
  const close = vi.fn(async () => undefined);
  const update = vi.fn(async (id: number) => tabs.find(tab => tab.id === id));
  return {
    close,
    update,
    api: {
      tabs: {
        query: vi.fn(async (query: { active?: boolean; currentWindow?: boolean }) => tabs.filter(tab =>
          (!query.active || tab.active) && (!query.currentWindow || tab.windowId === 10)
        )),
        get: vi.fn(async (id: number) => tabs.find(tab => tab.id === id)), update, remove: vi.fn(),
        onRemoved: event(), onUpdated: event(), onCreated: event(), onMoved: event(), onReplaced: event(), onActivated: event(),
      },
      windows: { getCurrent: vi.fn(async () => ({ id: 10 })), update: vi.fn(async () => ({})), onFocusChanged: event() },
      tabGroups: { query: vi.fn(async () => []), update: vi.fn(), onCreated: event(), onUpdated: event(), onRemoved: event() },
      sidePanel: { close },
    },
  };
}

async function expectOpenTabCount(count: number, windowCount?: number) {
  const label = windowCount === undefined
    ? `Open tabs: ${count}`
    : `Open tabs: ${count}; Chrome windows: ${windowCount}; current profile only`;
  await waitFor(() => expect(screen.getByRole('status', { name: label })).toBeVisible());
}

describe('side-panel browser-rendered interaction', () => {
  it('stays usable with 150 tabs and commits an URL search result from the keyboard', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const search = screen.getByRole('textbox', { name: 'Search tabs' });
    await expectOpenTabCount(150);
    expect(search).toHaveFocus();
    fireEvent.change(search, { target: { value: 'figma.example/final-target' } });
    await expectOpenTabCount(150);
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    fireEvent.keyDown(search, { key: 'Enter' });
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(150, { active: true }));
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('navigates search results with arrow keys and restores the original tab with Escape', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const search = screen.getByRole('textbox', { name: 'Search tabs' });
    await expectOpenTabCount(150);
    fireEvent.change(search, { target: { value: 'QA Tab 00' } });
    await expectOpenTabCount(150);

    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-2');
    expect(mock.update).not.toHaveBeenCalled();

    fireEvent.keyDown(search, { key: 'Escape' });
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(1, { active: true }));
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('keeps keyboard selection immediate and switch-free when pointer delay is one second', async () => {
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({ hoverPreviewDelayMs: 1000 }));
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const search = screen.getByRole('textbox', { name: 'Search tabs' });
    await expectOpenTabCount(150);
    fireEvent.change(search, { target: { value: 'QA Tab 00' } });
    await expectOpenTabCount(150);
    mock.update.mockClear();

    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-2');
    expect(mock.update).not.toHaveBeenCalled();
    fireEvent.keyDown(search, { key: 'Enter' });
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(2, { active: true }));
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('does not wrap from the first result to the last on ArrowUp', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const search = screen.getByRole('textbox', { name: 'Search tabs' });
    await expectOpenTabCount(150);
    fireEvent.change(search, { target: { value: 'QA Tab 00' } });
    await expectOpenTabCount(150);
    mock.update.mockClear();

    fireEvent.keyDown(search, { key: 'ArrowUp' });
    expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-1');
    expect(mock.update).not.toHaveBeenCalledWith(9, { active: true });
  });

  it('opens the first exact search result with Enter without requiring an arrow key', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const search = screen.getByRole('textbox', { name: 'Search tabs' });
    await expectOpenTabCount(150);
    fireEvent.change(search, { target: { value: 'figma.example/final-target' } });
    await expectOpenTabCount(150);
    mock.update.mockClear();

    fireEvent.keyDown(search, { key: 'Enter' });
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(150, { active: true }));
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('does nothing on Enter with no matches and ignores IME composition Enter', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const search = screen.getByRole('textbox', { name: 'Search tabs' });
    await expectOpenTabCount(150);

    fireEvent.keyDown(search, { key: 'Enter', keyCode: 229, isComposing: true });
    expect(mock.update).not.toHaveBeenCalled();
    fireEvent.change(search, { target: { value: 'zzzz-no-such-tab-qa' } });
    await screen.findByText('No tabs match your search');
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(mock.update).not.toHaveBeenCalled();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('does not hijack keyboard input intended for the sort control', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    await screen.findByText('Current order');
    const sort = screen.getByText('Current order').closest('[role="combobox"]');
    expect(sort).not.toBeNull();
    fireEvent.keyDown(sort!, { key: 'Enter' });
    fireEvent.keyDown(sort!, { key: 'ArrowDown' });
    expect(mock.update).not.toHaveBeenCalled();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('keeps the closed settings drawer out of the accessibility tree', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    await screen.findByText('Current order');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'open settings' }));
    expect(screen.getByRole('dialog', { name: 'User Settings' })).toBeVisible();
  });

  it('lets support links handle keyboard activation without switching an existing tab', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    await expectOpenTabCount(150);

    const supportLink = screen.getByRole('link', { name: 'Support TabShow' });
    expect(supportLink).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Buy me a coffee' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'open settings' }));
    const coffeeLink = within(screen.getByRole('dialog', { name: 'User Settings' })).getByRole('link', { name: 'Buy me a coffee' });

    for (const link of [supportLink, coffeeLink]) {
      expect(link).toHaveAttribute('href', 'https://buymeacoffee.com/saulius.developer');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      const enter = createEvent.keyDown(link, { key: 'Enter' });
      fireEvent(link, enter);
      expect(enter.defaultPrevented).toBe(false);
    }
    expect(mock.update).not.toHaveBeenCalled();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it.each(['Support TabShow', 'Buy me a coffee'])('restores the original tab with Escape while %s has focus', async (name) => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    await expectOpenTabCount(150);
    if (name === 'Buy me a coffee') {
      fireEvent.click(screen.getByRole('button', { name: 'open settings' }));
    }
    const link = screen.getByRole('link', { name });
    link.focus();
    expect(link).toHaveFocus();

    fireEvent.keyDown(link, { key: 'Escape' });

    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(1, { active: true }));
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('shows clear loading and empty-search states instead of a blank list', async () => {
    const loadingMock = browserWith150Tabs();
    loadingMock.api.tabs.query = vi.fn(() => new Promise(() => undefined));
    vi.stubGlobal('browser', loadingMock.api);
    const loadingRender = render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    expect(screen.getByText('Loading tabs…')).toBeVisible();
    expect(screen.getByText('Loading…')).toBeVisible();
    expect(screen.queryByRole('status', { name: 'Open tabs: 0' })).not.toBeInTheDocument();
    loadingRender.unmount();

    const loadedMock = browserWith150Tabs();
    vi.stubGlobal('browser', loadedMock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    await expectOpenTabCount(150);
    fireEvent.change(screen.getByRole('textbox', { name: 'Search tabs' }), { target: { value: 'zzzz-no-such-tab-qa' } });
    expect(await screen.findByText('No tabs match your search')).toBeVisible();
    expect(screen.getByText('Try a different title, URL, or domain.')).toBeVisible();
  });

  it('clearly marks tabs that require switching to another window', async () => {
    const mock = browserWith150Tabs(true);
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const allWindows = await screen.findByRole('button', { name: 'All windows' });
    fireEvent.click(allWindows);
    await waitFor(() => expect(allWindows).toHaveAttribute('aria-pressed', 'true'));
    await expectOpenTabCount(150, 2);
    fireEvent.change(screen.getByRole('textbox', { name: 'Search tabs' }), { target: { value: 'figma.example/final-target' } });
    await expectOpenTabCount(150, 2);
    expect(screen.queryByText('Live preview · Current window')).not.toBeInTheDocument();
  });

  it('restores the All Windows preference from local storage', async () => {
    const mock = browserWith150Tabs(true);
    vi.stubGlobal('browser', mock.api);
    const firstRender = render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    const allWindows = await screen.findByRole('button', { name: 'All windows' });
    fireEvent.click(allWindows);
    expect(allWindows).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem('tab.show.userSettings') ?? '{}').allWindows).toBe(true));
    firstRender.unmount();

    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    expect(await screen.findByRole('button', { name: 'All windows' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows an explainable local Chaos Score and keeps both engagement actions visible', async () => {
    const mock = browserWith150Tabs(true);
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);

    const scoreButton = await screen.findByRole('button', { name: /Open Tab Chaos Score:/ });
    expect(scoreButton).toBeVisible();
    expect(scoreButton).toHaveTextContent('CHAOS');
    const tabCountSummary = screen.getByTestId('tab-count-summary');
    expect(tabCountSummary).toHaveTextContent('OPEN TABS');
    expect(tabCountSummary).not.toHaveTextContent('CHAOS');
    expect(scoreButton).toHaveAttribute('data-chaos-color');
    expect(screen.getByTestId('chaos-score-content')).toHaveTextContent('CHAOS');
    expect(screen.queryByText('Live preview · Current window')).not.toBeInTheDocument();
    const topControls = screen.getByTestId('top-control-grid');
    expect(topControls).toContainElement(screen.getByTestId('tab-scope-control'));
    expect(topControls).toContainElement(screen.getByRole('textbox', { name: 'Search tabs' }));
    expect(topControls).toContainElement(screen.getByRole('button', { name: 'open settings' }));
    expect(topControls).toContainElement(scoreButton);
    expect(screen.queryByText(/Tab chaos ·/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Suggest a feature' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Tell a friend' })).toBeVisible();

    fireEvent.click(scoreButton);
    const dialog = screen.getByRole('dialog', { name: 'Tab Chaos Score' });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText('open tabs')).toBeVisible();
    expect(within(dialog).getByText('Calculated and stored locally. TabShow does not send your tab data anywhere. Come back later to see how your session changed.')).toBeVisible();
  });

  it('copies a paste-ready Chrome Store message from Tell a friend', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);

    fireEvent.click(await screen.findByRole('button', { name: 'Tell a friend' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('chromewebstore.google.com/detail/'));
    expect(await screen.findByText('Chrome extension link copied')).toBeVisible();
    expect(screen.getByText('Paste it into any message, email, or post.')).toBeVisible();
  });

  it('switches between dark, light, and persisted appearance settings', async () => {
    const mock = browserWith150Tabs();
    vi.stubGlobal('browser', mock.api);
    const firstRender = render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    fireEvent.click(await screen.findByRole('button', { name: 'open settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use dark appearance' }));
    await waitFor(() => expect(document.documentElement.dataset.colorScheme).toBe('dark'));
    expect(JSON.parse(window.localStorage.getItem('tab.show.userSettings') ?? '{}').appearanceMode).toBe('dark');
    firstRender.unmount();

    render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
    await waitFor(() => expect(document.documentElement.dataset.colorScheme).toBe('dark'));
    fireEvent.click(await screen.findByRole('button', { name: 'open settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use light appearance' }));
    await waitFor(() => expect(document.documentElement.dataset.colorScheme).toBe('light'));
    fireEvent.click(screen.getByRole('button', { name: 'Use system appearance' }));
    await waitFor(() => expect(screen.getByText('Following your system, currently light.')).toBeVisible());
  });
});
