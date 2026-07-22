import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTabs } from './useTabs';

type Listener = (...args: any[]) => void;
const event = () => {
  const listeners = new Set<Listener>();
  return {
    addListener: (listener: Listener) => listeners.add(listener),
    removeListener: (listener: Listener) => listeners.delete(listener),
    emit: (...args: any[]) => listeners.forEach(listener => listener(...args)),
  };
};

function createBrowserMock() {
  const tabs = [
    { id: 1, windowId: 10, index: 0, active: true, title: 'Origin', url: 'https://origin.example' },
    { id: 2, windowId: 10, index: 1, active: false, title: 'Target', url: 'https://target.example' },
    { id: 4, windowId: 10, index: 2, active: false, title: 'Second target', url: 'https://second.example' },
    { id: 3, windowId: 20, index: 0, active: true, title: 'Other window', url: 'https://other.example' },
  ];
  let focusedWindowId = 10;
  const events = {
    removed: event(), updated: event(), created: event(), moved: event(), replaced: event(), activated: event(),
    focusChanged: event(), groupCreated: event(), groupUpdated: event(), groupRemoved: event(),
  };
  const close = vi.fn(async () => undefined);
  const updateTab = vi.fn(async (tabId: number, changes: { active?: boolean }) => {
    const tab = tabs.find(candidate => candidate.id === tabId)!;
    if (changes.active) {
      tabs.filter(candidate => candidate.windowId === tab.windowId).forEach(candidate => { candidate.active = candidate.id === tabId; });
      events.activated.emit({ tabId, windowId: tab.windowId });
    }
    return tab;
  });
  const browserMock = {
    tabs: {
      query: vi.fn(async (query: { currentWindow?: boolean; active?: boolean }) => tabs.filter(tab =>
        (!query.currentWindow || tab.windowId === focusedWindowId) && (!query.active || tab.active)
      )),
      get: vi.fn(async (id: number) => tabs.find(tab => tab.id === id)),
      update: updateTab,
      remove: vi.fn(async () => undefined),
      onRemoved: events.removed, onUpdated: events.updated, onCreated: events.created,
      onMoved: events.moved, onReplaced: events.replaced, onActivated: events.activated,
    },
    windows: {
      getCurrent: vi.fn(async () => ({ id: focusedWindowId })),
      update: vi.fn(async (id: number) => { focusedWindowId = id; events.focusChanged.emit(id); return { id }; }),
      onFocusChanged: events.focusChanged,
    },
    tabGroups: {
      query: vi.fn(async () => []), update: vi.fn(async () => undefined),
      onCreated: events.groupCreated, onUpdated: events.groupUpdated, onRemoved: events.groupRemoved,
    },
    sidePanel: { close },
  };
  return { browserMock, close, events, tabs, updateTab, getFocusedWindow: () => focusedWindowId };
}

describe('useTabs interaction contract', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); });

  async function settleInitialization() {
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  }

  it('commits a fast click before hover delay and closes the host panel', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 250 }));
    await settleInitialization();
    expect(result.current.originalTab?.id).toBe(1);
    await act(async () => { await result.current.handleTabClick(2); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
    expect(result.current.originalTab?.id).toBe(2);
  });

  it('does not focus or activate another window during hover preview', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 0, allWindows: true }));
    await settleInitialization();
    expect(result.current.originalTab?.id).toBe(1);
    mock.updateTab.mockClear();
    await act(async () => { result.current.handleTabHover(3); await vi.runAllTimersAsync(); });
    expect(result.current.previewTabId).toBeNull();
    expect(mock.updateTab).not.toHaveBeenCalled();
    expect(mock.getFocusedWindow()).toBe(10);
  });

  it('switches windows only after an explicit cross-window click', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 0, allWindows: true }));
    await settleInitialization();
    await act(async () => { await result.current.handleTabClick(3); });
    expect(mock.updateTab).toHaveBeenCalledWith(3, { active: true });
    expect(mock.getFocusedWindow()).toBe(20);
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('cancels a delayed hover when the pointer leaves its row', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 250 }));
    await settleInitialization();
    mock.updateTab.mockClear();
    act(() => { result.current.handleTabHover(2); result.current.handleTabHoverEnd(2); });
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });
    expect(mock.updateTab).not.toHaveBeenCalled();
    expect(result.current.previewTabId).toBeNull();
  });

  it('restores the origin when the pointer leaves during an in-flight preview activation', async () => {
    const mock = createBrowserMock();
    let resolvePreview!: () => void;
    const previewActivation = new Promise<void>(resolve => { resolvePreview = resolve; });
    mock.updateTab.mockImplementation(async (tabId: number) => {
      if (tabId === 2) await previewActivation;
      mock.events.activated.emit({ tabId, windowId: 10 });
      return mock.tabs.find(tab => tab.id === tabId)!;
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    mock.updateTab.mockClear();

    act(() => { result.current.handleTabHover(2); });
    await act(async () => { await Promise.resolve(); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });

    let leavePromise!: Promise<void>;
    act(() => { leavePromise = result.current.handleSidePanelHoverEnd(); });
    await act(async () => {
      resolvePreview();
      await leavePromise;
    });

    expect(mock.updateTab.mock.calls.map(([tabId]) => tabId)).toEqual([2, 1]);
    expect(result.current.previewTabId).toBeNull();
  });

  it('lets an explicit click win over an in-flight preview activation', async () => {
    const mock = createBrowserMock();
    let resolvePreview!: () => void;
    const previewActivation = new Promise<void>(resolve => { resolvePreview = resolve; });
    mock.updateTab.mockImplementation(async (tabId: number) => {
      if (tabId === 2) await previewActivation;
      mock.events.activated.emit({ tabId, windowId: 10 });
      return mock.tabs.find(tab => tab.id === tabId)!;
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    mock.updateTab.mockClear();

    act(() => { result.current.handleTabHover(2); });
    await act(async () => { await Promise.resolve(); });
    let clickPromise!: Promise<void>;
    act(() => { clickPromise = result.current.handleTabClick(4); });
    await act(async () => {
      resolvePreview();
      await clickPromise;
    });

    expect(mock.updateTab.mock.calls.map(([tabId]) => tabId)).toEqual([2, 4]);
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('cancels a delayed preview when search or sorting changes intent', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 250 }));
    await settleInitialization();
    mock.updateTab.mockClear();
    act(() => { result.current.handleTabHover(2); result.current.cancelPendingPreview(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });
    expect(mock.updateTab).not.toHaveBeenCalled();
  });

  it('does not replace the origin when the all-windows scope changes', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result, rerender } = renderHook(({ allWindows }) => useTabs({ allWindows }), { initialProps: { allWindows: false } });
    await settleInitialization();
    expect(result.current.originalTab?.id).toBe(1);
    rerender({ allWindows: true });
    await settleInitialization();
    expect(result.current.originalTab?.id).toBe(1);
  });

  it('serializes rapid previews so the latest requested tab wins', async () => {
    const mock = createBrowserMock();
    let resolveFirst!: () => void;
    let resolveSecond!: () => void;
    const first = new Promise<void>(resolve => { resolveFirst = resolve; });
    const second = new Promise<void>(resolve => { resolveSecond = resolve; });
    mock.updateTab.mockImplementation(async (tabId: number) => {
      if (tabId === 2) await first;
      if (tabId === 4) await second;
      mock.events.activated.emit({ tabId, windowId: 10 });
      return mock.tabs.find(tab => tab.id === tabId)!;
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 0, allWindows: true }));
    await settleInitialization();
    act(() => { result.current.handleTabHover(2); result.current.handleTabHover(4); });
    await act(async () => { await Promise.resolve(); });
    expect(mock.updateTab).toHaveBeenCalledTimes(1);
    await act(async () => { resolveFirst(); await Promise.resolve(); await Promise.resolve(); });
    expect(mock.updateTab).toHaveBeenCalledTimes(2);
    await act(async () => { resolveSecond(); await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.previewTabId).toBe(4);
  });
});
