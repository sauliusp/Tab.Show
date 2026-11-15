import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { UserSettingsProvider } from '../../src/contexts/UserSettingsContext';
import { ColorSchemeProvider } from '../../src/contexts/ColorSchemeContext';

function browserEvent() {
  const listeners = new Set<(...args: any[]) => unknown>();
  return {
    addListener: (listener: (...args: any[]) => unknown) => listeners.add(listener),
    removeListener: (listener: (...args: any[]) => unknown) => listeners.delete(listener),
    emit: (...args: any[]) => [...listeners].forEach(listener => listener(...args)),
  };
}

function createBrowser(activeId = 140) {
  const tabs = Array.from({ length: 150 }, (_, index) => ({
    id: index + 1, windowId: 10, index, active: index + 1 === activeId,
    title: `Work tab ${String(index + 1).padStart(3, '0')}`,
    url: `https://site${index % 5}.example/page/${index + 1}`,
    lastAccessed: 20_000 - index,
  }));
  const onActivated = browserEvent();
  const onUpdated = browserEvent();
  const close = vi.fn(async () => undefined);
  const update = vi.fn(async (id: number) => {
    const tab = tabs.find(item => item.id === id)!;
    tabs.forEach(item => { item.active = item.id === id; });
    onActivated.emit({ tabId: id, windowId: tab.windowId });
    return { ...tab };
  });
  const api = {
    tabs: {
      query: vi.fn(async (query: { active?: boolean }) => tabs.filter(tab => !query.active || tab.active).map(tab => ({ ...tab }))),
      get: vi.fn(async (id: number) => ({ ...tabs.find(tab => tab.id === id)! })), update, remove: vi.fn(),
      onActivated, onUpdated, onRemoved: browserEvent(), onCreated: browserEvent(), onMoved: browserEvent(), onReplaced: browserEvent(),
    },
    windows: { getCurrent: vi.fn(async () => ({ id: 10 })), update: vi.fn(), onFocusChanged: browserEvent() },
    tabGroups: { query: vi.fn(async () => []), update: vi.fn(), onCreated: browserEvent(), onUpdated: browserEvent(), onRemoved: browserEvent() },
    sidePanel: { close },
  };
  vi.stubGlobal('browser', api);
  return { api, tabs, update, close };
}

const originalScrollTo = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTo');

// jsdom has no layout. Supply only viewport geometry and scrolling; the real
// production TabList and TanStack virtualizer still choose/render the rows.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) { return this.id === 'tab-results' ? 400 : 0; });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(420);
  Object.defineProperty(ResizeObserver.prototype, 'unobserve', { configurable: true, value() {} });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: function (this: HTMLElement, options: ScrollToOptions) {
    this.scrollTop = options.top ?? this.scrollTop;
    queueMicrotask(() => this.dispatchEvent(new Event('scroll')));
  } });
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(ResizeObserver.prototype, 'unobserve');
  if (originalScrollTo) Object.defineProperty(HTMLElement.prototype, 'scrollTo', originalScrollTo);
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
});

function renderPanel() {
  return render(<UserSettingsProvider><ColorSchemeProvider><App /></ColorSchemeProvider></UserSettingsProvider>);
}

async function loadedPanel() {
  const grid = await screen.findByRole('grid', { name: 'Open tabs' });
  await waitFor(() => expect(grid).toHaveAttribute('aria-rowcount', '150'));
  return { grid, search: screen.getByRole('combobox', { name: 'Search tabs' }) };
}

describe('persistent panel and scroll intent', () => {
  it('reveals the active tab deep in a 150-tab list and keeps keyboard selection after clearing search', async () => {
    const mock = createBrowser();
    renderPanel();
    const { grid, search } = await loadedPanel();
    await waitFor(() => expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-140'));
    expect(grid.scrollTop).toBeGreaterThan(6000);
    expect(screen.getByRole('button', { name: /Open Work tab 140,/ })).toBeVisible();
    expect(document.getElementById('tab-option-140')).toHaveAttribute('aria-rowindex', '140');

    fireEvent.change(search, { target: { value: 'Work tab 00' } });
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-2');
    fireEvent.change(search, { target: { value: '' } });
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-2');
    expect(grid.scrollTop).toBeLessThan(400);
    expect(mock.update).not.toHaveBeenCalled();
  });

  it('preserves a manual scroll through pointer highlighting and background title updates', async () => {
    const mock = createBrowser(1);
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({ hoverPreviewEnabled: false }));
    renderPanel();
    const { grid, search } = await loadedPanel();
    await waitFor(() => expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-1'));
    fireEvent.scroll(grid, { target: { scrollTop: 2700 } });
    await screen.findByRole('button', { name: /Open Work tab 055,/ });
    fireEvent.mouseEnter(document.getElementById('tab-option-55')!);
    expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-55');
    expect(grid.scrollTop).toBe(2700);
    act(() => mock.api.tabs.onUpdated.emit(55, { title: 'Updated title' }, { ...mock.tabs[54], title: 'Updated title' }));
    await screen.findByRole('button', { name: /Open Updated title,/ });
    expect(grid.scrollTop).toBe(2700);
    expect(mock.update).not.toHaveBeenCalled();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('restores saved sorting and keeps it after the panel is reopened', async () => {
    createBrowser(140);
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({ sortMode: 'recently-opened' }));
    const first = renderPanel();
    const { grid } = await loadedPanel();
    expect(screen.getByRole('combobox', { name: 'Sort tabs' })).toHaveTextContent('Recently added (approx.)');
    await waitFor(() => expect(document.getElementById('tab-option-140')).toHaveAttribute('aria-rowindex', '11'));
    expect(grid.scrollTop).toBeLessThan(600);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Sort tabs' }));
    fireEvent.click(await screen.findByRole('option', { name: 'By domain' }));
    first.unmount();
    renderPanel();
    await loadedPanel();
    expect(screen.getByRole('combobox', { name: 'Sort tabs' })).toHaveTextContent('By domain');
  });

  it('keeps the panel open after click and Enter, and Escape returns to the last committed tab', async () => {
    const mock = createBrowser(1);
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({ keepPanelOpen: true, hoverPreviewDelayMs: 0 }));
    renderPanel();
    const { grid, search } = await loadedPanel();
    fireEvent.click(screen.getByRole('button', { name: /Open Work tab 002,/ }));
    await waitFor(() => expect(search).toHaveAttribute('aria-activedescendant', 'tab-option-2'));
    expect(mock.close).not.toHaveBeenCalled();
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    fireEvent.keyDown(search, { key: 'Enter' });
    await waitFor(() => expect(mock.update).toHaveBeenLastCalledWith(3, { active: true }));
    expect(mock.close).not.toHaveBeenCalled();
    fireEvent.mouseMove(document.getElementById('tab-option-4')!);
    await waitFor(() => expect(mock.update).toHaveBeenLastCalledWith(4, { active: true }));
    const openLastCommitted = screen.getByRole('button', { name: /Open Work tab 003,/ });
    openLastCommitted.focus();
    fireEvent.keyDown(openLastCommitted, { key: 'Escape' });
    await waitFor(() => expect(mock.close).toHaveBeenCalledWith({ windowId: 10 }));
    expect(mock.update).toHaveBeenLastCalledWith(3, { active: true });
    expect(grid.querySelector('button button, [role=button] button')).toBeNull();
  });
});
