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
