import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTabChaos } from './useTabChaos';

function event() {
  return {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
}

describe('useTabChaos tab movement events', () => {
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
    const detachedListener = onDetached.addListener.mock.calls[0][0];
    const attachedListener = onAttached.addListener.mock.calls[0][0];

    unmount();

    expect(onDetached.removeListener).toHaveBeenCalledWith(detachedListener);
    expect(onAttached.removeListener).toHaveBeenCalledWith(attachedListener);
  });
});
