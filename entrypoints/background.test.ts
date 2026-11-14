import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('installation and update pages', () => {
  let installed: (details: { reason: string; previousVersion?: string }) => Promise<void>;
  const create = vi.fn();
  const setPanelBehavior = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    create.mockReset().mockResolvedValue({});
    setPanelBehavior.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal('defineBackground', (setup: () => void) => setup());
    vi.stubGlobal('browser', {
      runtime: {
        onInstalled: { addListener: (handler: typeof installed) => { installed = handler; } },
        getURL: (path: string) => `chrome-extension://test${path}`,
        getManifest: () => ({ version: '2.4.0' }),
      },
      sidePanel: { setPanelBehavior },
      tabs: { create },
    });
    await import('./background');
  });

  it('opens a first-use page and enables the toolbar action on installation', async () => {
    await installed({ reason: 'install' });
    expect(setPanelBehavior).toHaveBeenCalledWith({ openPanelOnActionClick: true });
    expect(create).toHaveBeenCalledWith({ url: 'chrome-extension://test/pages/welcome/index.html' });
  });

  it('announces a feature update without taking focus from the current page', async () => {
    await installed({ reason: 'update', previousVersion: '2.3.0' });
    expect(create).toHaveBeenCalledWith({ url: 'chrome-extension://test/pages/whats-new/index.html', active: false });
  });

  it.each([
    { reason: 'update', previousVersion: '2.4.0' },
    { reason: 'update', previousVersion: '2.4.1' },
    { reason: 'chrome_update', previousVersion: '2.3.0' },
  ])('does not open notes for reloads, downgrades, or browser updates: %j', async details => {
    await installed(details);
    expect(create).not.toHaveBeenCalled();
  });
});
