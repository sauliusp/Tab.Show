import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTabChaos } from './useTabChaos';

function event() {
  const listeners = new Set<(...args: unknown[]) => void>();
  return {
    addListener: vi.fn((listener: (...args: unknown[]) => void) => listeners.add(listener)),
    removeListener: vi.fn((listener: (...args: unknown[]) => void) => listeners.delete(listener)),
    emit: (...args: unknown[]) => listeners.forEach(listener => listener(...args)),
  };
}

describe('useTabChaos tab movement events', () => {
  afterEach(() => vi.useRealTimers());

  it('refreshes for cross-window detach and attach events and removes both listeners', async () => {
    const onDetached = event();
    const onAttached = event();
    const browserMock = {
      tabs: {
        query: vi.fn(async () => [{ id: 1, windowId: 10, index: 0, active: true, url: 'https://example.com' }]),
        onCreated: event(),
        onRemoved: event(),
        onUpdated: event(),
        onMoved: event(),
        onDetached,
        onAttached,
        onActivated: event(),
      },
      windows: {
        getCurrent: vi.fn(async () => ({ id: 10 })),
        onFocusChanged: event(),
      },
      tabGroups: {
        query: vi.fn(async () => []),
        onCreated: event(),
        onUpdated: event(),
        onRemoved: event(),
      },
    };
    vi.stubGlobal('browser', browserMock);

    const { unmount } = renderHook(() => useTabChaos());

    expect(onDetached.addListener).toHaveBeenCalledOnce();
    expect(onAttached.addListener).toHaveBeenCalledOnce();
    const detachedListener = onDetached.addListener.mock.calls[0]?.[0];
    const attachedListener = onAttached.addListener.mock.calls[0]?.[0];
    expect(detachedListener).toEqual(expect.any(Function));
    expect(attachedListener).toEqual(expect.any(Function));

    unmount();

    expect(onDetached.removeListener).toHaveBeenCalledWith(detachedListener);
    expect(onAttached.removeListener).toHaveBeenCalledWith(attachedListener);
  });

  it('ignores an older refresh that finishes after a newer tab snapshot', async () => {
    vi.useFakeTimers();
    let resolveFirst!: (tabs: Array<{ id: number; windowId: number; index: number; active: boolean; url: string }>) => void;
    const firstQuery = new Promise<Array<{ id: number; windowId: number; index: number; active: boolean; url: string }>>(resolve => { resolveFirst = resolve; });
    const onUpdated = event();
    const newerTabs = [
      { id: 1, windowId: 10, index: 0, active: true, url: 'https://one.example' },
      { id: 2, windowId: 10, index: 1, active: false, url: 'https://two.example' },
    ];
    const browserMock = {
      tabs: {
        query: vi.fn()
          .mockReturnValueOnce(firstQuery)
          .mockResolvedValueOnce(newerTabs),
        onCreated: event(),
        onRemoved: event(),
        onUpdated,
        onMoved: event(),
        onDetached: event(),
        onAttached: event(),
        onActivated: event(),
      },
      windows: {
        getCurrent: vi.fn(async () => ({ id: 10 })),
        onFocusChanged: event(),
      },
      tabGroups: {
        query: vi.fn(async () => []),
        onCreated: event(),
        onUpdated: event(),
        onRemoved: event(),
      },
    };
    vi.stubGlobal('browser', browserMock);

    const { result, unmount } = renderHook(() => useTabChaos());
    onUpdated.emit(1, {});
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120);
      await Promise.resolve();
    });
    expect(result.current.stats?.totalTabs).toBe(2);

    await act(async () => {
      resolveFirst([{ id: 1, windowId: 10, index: 0, active: true, url: 'https://stale.example' }]);
      await Promise.resolve();
    });
    expect(result.current.stats?.totalTabs).toBe(2);

    unmount();
  });

  it('recomputes the displayed trend from live stats without recording another check-in', async () => {
    vi.useFakeTimers();
    window.localStorage.setItem('tab.show.chaosHistory.v1', JSON.stringify({
      observations: [{
        timestamp: new Date(2026, 7, 31, 12).getTime(),
        day: '2026-08-31',
        score: 25,
        tabCount: 10,
      }],
      bestScore: 20,
    }));
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const onRemoved = event();
    const initialTabs = Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      windowId: 10,
      index,
      active: index === 0,
      url: `https://initial.example/${index}`,
    }));
    const refreshedTabs = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      windowId: 10,
      index,
      active: index === 0,
      url: `https://refreshed.example/${index}`,
    }));
    const browserMock = {
      tabs: {
        query: vi.fn()
          .mockResolvedValueOnce(initialTabs)
          .mockResolvedValueOnce(refreshedTabs),
        onCreated: event(),
        onRemoved,
        onUpdated: event(),
        onMoved: event(),
        onDetached: event(),
        onAttached: event(),
        onActivated: event(),
      },
      windows: {
        getCurrent: vi.fn(async () => ({ id: 10 })),
        onFocusChanged: event(),
      },
      tabGroups: {
        query: vi.fn(async () => []),
        onCreated: event(),
        onUpdated: event(),
        onRemoved: event(),
      },
    };
    vi.stubGlobal('browser', browserMock);

    const { result, unmount } = renderHook(() => useTabChaos());
    await act(async () => { await Promise.resolve(); });
    const initialScore = result.current.stats!.score;
    expect(result.current.trend?.scoreDelta).toBe(initialScore - 25);
    expect(setItem).toHaveBeenCalledTimes(1);

    onRemoved.emit(41, {});
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120);
      await Promise.resolve();
    });

    expect(result.current.stats?.totalTabs).toBe(15);
    expect(result.current.trend).toMatchObject({
      previousScore: 25,
      scoreDelta: result.current.stats!.score - 25,
      tabsDelta: 5,
      bestScore: 20,
    });
    expect(result.current.trend?.message).toBe(
      result.current.stats!.score < 25
        ? `Down ${25 - result.current.stats!.score} points since your last check.`
        : result.current.stats!.score > 25
          ? `Up ${result.current.stats!.score - 25} points since your last check.`
          : 'Steady since your last check.',
    );
    expect(setItem).toHaveBeenCalledTimes(1);

    unmount();
  });
});
