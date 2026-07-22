import { afterEach, describe, expect, it, vi } from 'vitest';
import { tabService } from './TabService';

describe('TabService side-panel close', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('closes the explicitly supplied host window', async () => {
    const close = vi.fn(async () => undefined);
    vi.stubGlobal('browser', { sidePanel: { close }, windows: { getCurrent: vi.fn() } });
    await tabService.closeSidePanel(42);
    expect(close).toHaveBeenCalledWith({ windowId: 42 });
  });

  it('falls back to window.close when the native API rejects', async () => {
    const closeDocument = vi.spyOn(window, 'close').mockImplementation(() => undefined);
    vi.stubGlobal('browser', { sidePanel: { close: vi.fn(async () => { throw new Error('unsupported'); }) }, windows: { getCurrent: vi.fn() } });
    await tabService.closeSidePanel(42);
    expect(closeDocument).toHaveBeenCalledOnce();
  });
});

describe('TabService tab activation focus', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does not refocus the Chrome window for a same-window preview', async () => {
    const updateWindow = vi.fn();
    const updateTab = vi.fn(async () => undefined);
    vi.stubGlobal('browser', {
      tabs: { get: vi.fn(async () => ({ id: 2, windowId: 10 })), update: updateTab },
      windows: { getCurrent: vi.fn(async () => ({ id: 10 })), update: updateWindow },
    });

    await tabService.activateTab(2);
    expect(updateWindow).not.toHaveBeenCalled();
    expect(updateTab).toHaveBeenCalledWith(2, { active: true });
  });

  it('focuses the destination window for an explicit cross-window switch', async () => {
    const updateWindow = vi.fn(async () => undefined);
    const updateTab = vi.fn(async () => undefined);
    vi.stubGlobal('browser', {
      tabs: { get: vi.fn(async () => ({ id: 3, windowId: 20 })), update: updateTab },
      windows: { getCurrent: vi.fn(async () => ({ id: 10 })), update: updateWindow },
    });

    await tabService.activateTab(3);
    expect(updateWindow).toHaveBeenCalledWith(20, { focused: true });
    expect(updateTab).toHaveBeenCalledWith(3, { active: true });
  });
});
