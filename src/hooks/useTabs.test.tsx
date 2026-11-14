import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTabs } from './useTabs';
import { selectTabs } from '../utils/tabSelectors';
import type { Tab } from '../types/Tab';

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
    { id: 1, windowId: 10, index: 0, active: true, title: 'Origin', url: 'https://origin.example', lastAccessed: 300 },
    { id: 2, windowId: 10, index: 1, active: false, title: 'Target', url: 'https://target.example', lastAccessed: 200 },
    { id: 4, windowId: 10, index: 2, active: false, title: 'Second target', url: 'https://second.example', lastAccessed: 100 },
    { id: 3, windowId: 20, index: 0, active: true, title: 'Other window', url: 'https://other.example', lastAccessed: 400 },
  ];
  let focusedWindowId = 10;
  const events = {
    removed: event(), updated: event(), created: event(), moved: event(), detached: event(), attached: event(), replaced: event(), activated: event(),
    focusChanged: event(), groupCreated: event(), groupUpdated: event(), groupRemoved: event(),
  };
  const close = vi.fn(async () => undefined);
  const updateTab = vi.fn(async (tabId: number, changes: { active?: boolean }) => {
    const tab = tabs.find(candidate => candidate.id === tabId)!;
    if (changes.active) {
      tabs.filter(candidate => candidate.windowId === tab.windowId).forEach(candidate => { candidate.active = candidate.id === tabId; });
      tab.lastAccessed = Date.now();
      events.activated.emit({ tabId, windowId: tab.windowId });
    }
    return { ...tab };
  });
  const browserMock = {
    tabs: {
      query: vi.fn(async (query: { currentWindow?: boolean; active?: boolean }) => tabs.filter(tab =>
        (!query.currentWindow || tab.windowId === focusedWindowId) && (!query.active || tab.active)
      ).map(tab => ({ ...tab }))),
      get: vi.fn(async (id: number) => {
        const tab = tabs.find(tab => tab.id === id);
        return tab ? { ...tab } : undefined;
      }),
      update: updateTab,
      remove: vi.fn(async () => undefined),
      onRemoved: events.removed, onUpdated: events.updated, onCreated: events.created,
      onMoved: events.moved, onReplaced: events.replaced, onActivated: events.activated,
      onDetached: events.detached, onAttached: events.attached,
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

  it('keeps the panel open and uses each committed tab as the next preview origin', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true, hoverPreviewDelayMs: 0 }));
    await settleInitialization();

    await act(async () => { await result.current.handleTabClick(2); });
    expect(result.current.originalTab?.id).toBe(2);
    expect(mock.close).not.toHaveBeenCalled();

    await act(async () => { result.current.handleTabHover(4); });
    expect(result.current.previewTabId).toBe(4);
    await act(async () => { await result.current.handleSidePanelHoverEnd(); });
    expect(mock.updateTab).toHaveBeenLastCalledWith(2, { active: true });
    expect(result.current.previewTabId).toBeNull();

    await act(async () => { await result.current.handleTabClick(4); });
    expect(result.current.originalTab?.id).toBe(4);
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('updates Recently used after a persistent selection without reordering on hover', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true, hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    const recentOrder = () => selectTabs(
      Object.values(result.current.tabListState.items).filter(item => item.type === 'tab').map(item => item.data as Tab),
      { query: '', sortMode: 'recently-used', currentWindowId: 10 },
    ).map(tab => tab.id);
    expect(recentOrder()).toEqual([1, 2, 4]);

    await act(async () => { result.current.handleTabHover(4); });
    expect(mock.tabs.find(tab => tab.id === 4)?.lastAccessed).toBe(Date.now());
    expect(recentOrder()).toEqual([1, 2, 4]);

    await act(async () => { await result.current.handleTabClick(4); });
    expect(recentOrder()).toEqual([4, 1, 2]);
    expect((result.current.tabListState.items['tab-4']?.data as Tab).lastAccessed).toBe(Date.now());
    expect(result.current.originalTab?.lastAccessed).toBe(Date.now());
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('refreshes the last-accessed metadata after a manual host-window selection', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true }));
    await settleInitialization();
    const selectedTab = mock.tabs.find(tab => tab.id === 2)!;
    selectedTab.lastAccessed = Date.now();

    await act(async () => { mock.events.activated.emit({ tabId: 2, windowId: 10 }); });

    expect((result.current.tabListState.items['tab-2']?.data as Tab).lastAccessed).toBe(Date.now());
    expect(result.current.originalTab?.lastAccessed).toBe(Date.now());
  });

  it.each([true, false])('keeps the latest rapid selection when hover previews remain %s', async (enabled) => {
    const mock = createBrowserMock();
    let finishFirst!: () => void;
    let finishSecond!: () => void;
    const firstActivation = new Promise<void>(resolve => { finishFirst = resolve; });
    const secondActivation = new Promise<void>(resolve => { finishSecond = resolve; });
    const activate = mock.updateTab.getMockImplementation()!;
    mock.updateTab.mockImplementation(async (tabId, changes) => {
      if (tabId === 2) await firstActivation;
      if (tabId === 4) await secondActivation;
      return activate(tabId, changes);
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result, rerender } = renderHook(({ previews }) => useTabs({
      keepPanelOpen: true, hoverPreviewDelayMs: 0, hoverPreviewEnabled: previews,
    }), { initialProps: { previews: true } });
    await settleInitialization();
    let first!: Promise<void>;
    let second!: Promise<void>;
    await act(async () => { first = result.current.handleTabClick(2); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });
    act(() => { second = result.current.handleTabClick(4); });
    await act(async () => {
      finishFirst();
      await first;
    });
    expect(mock.updateTab).toHaveBeenCalledWith(4, { active: true });

    rerender({ previews: enabled });
    act(() => { result.current.handleTabHover(1); });
    let leave!: Promise<void>;
    act(() => { leave = result.current.handleSidePanelHoverEnd(); });
    await act(async () => { finishSecond(); await second; await leave; });

    expect(mock.tabs.find(tab => tab.windowId === 10 && tab.active)?.id).toBe(4);
    expect(result.current.originalTab?.id).toBe(4);
    expect(result.current.previewTabId).toBeNull();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('lets Escape cancel an in-flight persistent selection without changing the return target', async () => {
    const mock = createBrowserMock();
    let finishSelection!: () => void;
    const pendingSelection = new Promise<void>(resolve => { finishSelection = resolve; });
    const activate = mock.updateTab.getMockImplementation()!;
    mock.updateTab.mockImplementation(async (tabId, changes) => {
      if (tabId === 2) await pendingSelection;
      return activate(tabId, changes);
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true, hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    let selection!: Promise<void>;
    await act(async () => { selection = result.current.handleTabClick(2); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });
    let cancellation!: Promise<void>;
    act(() => { cancellation = result.current.handleCancel(); });
    // Pointer events arriving while Escape is restoring cannot create a new preview.
    act(() => { result.current.handleTabHover(4); });
    await act(async () => { finishSelection(); await selection; await cancellation; });

    expect(mock.tabs.find(tab => tab.windowId === 10 && tab.active)?.id).toBe(1);
    expect(result.current.originalTab?.id).toBe(1);
    expect(result.current.previewTabId).toBeNull();
    expect(mock.close).toHaveBeenCalledOnce();
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('recognizes a slow programmatic activation instead of treating it as a manual choice', async () => {
    const mock = createBrowserMock();
    let finishSelection!: () => void;
    const pendingSelection = new Promise<void>(resolve => { finishSelection = resolve; });
    const activate = mock.updateTab.getMockImplementation()!;
    mock.updateTab.mockImplementation(async (tabId, changes) => {
      if (tabId === 2) await pendingSelection;
      return activate(tabId, changes);
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs());
    await settleInitialization();
    let selection!: Promise<void>;
    await act(async () => { selection = result.current.handleTabClick(2); });
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    await act(async () => { finishSelection(); await selection; });

    expect(result.current.originalTab?.id).toBe(2);
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('preserves the host origin when a persistent panel selects another window', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true, allWindows: true }));
    await settleInitialization();

    await act(async () => { await result.current.handleTabClick(3); });

    expect(mock.updateTab).toHaveBeenLastCalledWith(3, { active: true });
    expect(mock.getFocusedWindow()).toBe(20);
    expect(result.current.originalTab?.id).toBe(1);
    expect(result.current.previewTabId).toBeNull();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('restores the host preview before switching a persistent panel to another window', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true, allWindows: true, hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    await act(async () => { result.current.handleTabHover(2); });
    mock.updateTab.mockClear();

    await act(async () => { await result.current.handleTabClick(3); });

    expect(mock.updateTab.mock.calls.map(([tabId]) => tabId)).toEqual([1, 3]);
    expect(mock.tabs.find(tab => tab.id === 1)?.active).toBe(true);
    expect(mock.getFocusedWindow()).toBe(20);
    expect(result.current.originalTab?.id).toBe(1);
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('still restores the selected origin and closes a persistent panel on Escape', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ keepPanelOpen: true, hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    await act(async () => { await result.current.handleTabClick(2); });
    await act(async () => { result.current.handleTabHover(4); });

    await act(async () => { await result.current.handleCancel(); });

    expect(mock.updateTab).toHaveBeenLastCalledWith(2, { active: true });
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('allows explicit selection with hover preview disabled', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewEnabled: false, hoverPreviewDelayMs: 0 }));
    await settleInitialization();
    await act(async () => { result.current.handleTabHover(2); await vi.runAllTimersAsync(); });
    expect(mock.updateTab).not.toHaveBeenCalled();

    await act(async () => { await result.current.handleTabClick(2); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });
    expect(mock.close).toHaveBeenCalledWith({ windowId: 10 });
  });

  it('cancels pending hover and rejects retained callbacks when preview is disabled', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result, rerender } = renderHook(({ enabled }) => useTabs({ hoverPreviewEnabled: enabled, hoverPreviewDelayMs: 250 }), { initialProps: { enabled: true } });
    await settleInitialization();
    const retainedHover = result.current.handleTabHover;
    act(() => { retainedHover(2); });

    rerender({ enabled: false });
    await act(async () => { retainedHover(4); await vi.advanceTimersByTimeAsync(300); });
    expect(mock.updateTab).not.toHaveBeenCalled();
    expect(result.current.previewTabId).toBeNull();

    rerender({ enabled: true });
    await act(async () => { result.current.handleTabHover(2); await vi.advanceTimersByTimeAsync(250); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });
  });

  it('restores an active preview without closing the panel when preview is disabled', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result, rerender } = renderHook(({ enabled }) => useTabs({ hoverPreviewEnabled: enabled, hoverPreviewDelayMs: 0 }), { initialProps: { enabled: true } });
    await settleInitialization();
    await act(async () => { result.current.handleTabHover(2); });
    expect(result.current.previewTabId).toBe(2);

    rerender({ enabled: false });
    await act(async () => { await Promise.resolve(); });

    expect(mock.updateTab).toHaveBeenLastCalledWith(1, { active: true });
    expect(result.current.previewTabId).toBeNull();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('restores after an in-flight activation finishes when preview is disabled', async () => {
    const mock = createBrowserMock();
    let finishPreview!: () => void;
    const pending = new Promise<void>(resolve => { finishPreview = resolve; });
    mock.updateTab.mockImplementation(async (tabId: number) => {
      if (tabId === 2) await pending;
      mock.events.activated.emit({ tabId, windowId: 10 });
      return mock.tabs.find(tab => tab.id === tabId)!;
    });
    vi.stubGlobal('browser', mock.browserMock);
    const { result, rerender } = renderHook(({ enabled }) => useTabs({ hoverPreviewEnabled: enabled, hoverPreviewDelayMs: 0 }), { initialProps: { enabled: true } });
    await settleInitialization();
    await act(async () => { result.current.handleTabHover(2); });

    rerender({ enabled: false });
    await act(async () => { finishPreview(); });

    expect(mock.updateTab.mock.calls.map(([tabId]) => tabId)).toEqual([2, 1]);
    expect(result.current.previewTabId).toBeNull();
    expect(mock.close).not.toHaveBeenCalled();
  });

  it('cancels an old delay and makes retained callbacks use the new delay', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result, rerender } = renderHook(({ delay }) => useTabs({ hoverPreviewDelayMs: delay }), { initialProps: { delay: 250 } });
    await settleInitialization();
    const retainedHover = result.current.handleTabHover;
    act(() => { retainedHover(2); });

    rerender({ delay: 1000 });
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });
    expect(mock.updateTab).not.toHaveBeenCalled();

    act(() => { retainedHover(4); });
    await act(async () => { await vi.advanceTimersByTimeAsync(999); });
    expect(mock.updateTab).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(mock.updateTab).toHaveBeenCalledWith(4, { active: true });
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

  it('keeps the host-window origin when another window activates a tab during preview', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 0, allWindows: true }));
    await settleInitialization();
    await act(async () => { result.current.handleTabHover(2); });
    expect(result.current.previewTabId).toBe(2);

    await act(async () => { mock.events.activated.emit({ tabId: 3, windowId: 20 }); });

    expect(result.current.originalTab?.id).toBe(1);
    expect(result.current.previewTabId).toBe(2);
    await act(async () => { await result.current.handleSidePanelHoverEnd(); });
    expect(mock.updateTab).toHaveBeenLastCalledWith(1, { active: true });
    expect(mock.browserMock.windows.update).not.toHaveBeenCalled();
  });

  it('cancels a pending preview when a manual host-window selection changes the origin', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 250, keepPanelOpen: true }));
    await settleInitialization();
    act(() => { result.current.handleTabHover(2); });

    await act(async () => { mock.events.activated.emit({ tabId: 4, windowId: 10 }); });
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });

    expect(result.current.originalTab?.id).toBe(4);
    expect(result.current.previewTabId).toBeNull();
    expect(mock.updateTab).not.toHaveBeenCalled();
  });

  it('refreshes current-window tabs when a tab moves out of or into the host window', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result, unmount } = renderHook(() => useTabs());
    await settleInitialization();
    expect(result.current.tabListState.items['tab-2']).toBeDefined();
    expect(result.current.tabListState.items['tab-3']).toBeUndefined();

    mock.tabs.find(tab => tab.id === 2)!.windowId = 20;
    await act(async () => { mock.events.detached.emit(2, { oldWindowId: 10, oldPosition: 1 }); });
    expect(result.current.tabListState.items['tab-2']).toBeUndefined();

    mock.tabs.find(tab => tab.id === 3)!.windowId = 10;
    await act(async () => { mock.events.attached.emit(3, { newWindowId: 10, newPosition: 2 }); });
    expect(result.current.tabListState.items['tab-3']?.data.windowId).toBe(10);

    unmount();
    mock.browserMock.tabs.query.mockClear();
    mock.events.detached.emit(3, { oldWindowId: 10, oldPosition: 2 });
    mock.events.attached.emit(2, { newWindowId: 10, newPosition: 1 });
    expect(mock.browserMock.tabs.query).not.toHaveBeenCalled();
  });

  it('updates window ownership in all-windows scope after a tab is attached elsewhere', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ allWindows: true }));
    await settleInitialization();
    mock.tabs.find(tab => tab.id === 2)!.windowId = 20;

    await act(async () => { mock.events.attached.emit(2, { newWindowId: 20, newPosition: 1 }); });

    expect(result.current.tabListState.items['tab-2']?.data.windowId).toBe(20);
    expect(Object.values(result.current.tabListState.items).filter(item => item.type === 'tab')).toHaveLength(4);
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

  it('honors the full 1000 ms pointer preview delay', async () => {
    const mock = createBrowserMock();
    vi.stubGlobal('browser', mock.browserMock);
    const { result } = renderHook(() => useTabs({ hoverPreviewDelayMs: 1000 }));
    await settleInitialization();
    mock.updateTab.mockClear();

    act(() => { result.current.handleTabHover(2); });
    await act(async () => { await vi.advanceTimersByTimeAsync(999); });
    expect(mock.updateTab).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(mock.updateTab).toHaveBeenCalledWith(2, { active: true });
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
