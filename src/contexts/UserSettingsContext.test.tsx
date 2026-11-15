import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UserSettingsProvider, useUserSettings } from './UserSettingsContext';

describe('UserSettingsProvider persisted behavior', () => {
  it('restores all switching choices when the panel is reopened without resetting existing preferences', () => {
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({
      appearanceMode: 'dark', hoverPreviewDelayMs: 450, allWindows: true,
    }));
    const first = renderHook(() => useUserSettings(), { wrapper: UserSettingsProvider });
    act(() => {
      first.result.current.setKeepPanelOpen(true);
      first.result.current.setHoverPreviewEnabled(false);
      first.result.current.setSortMode('recently-used');
    });
    first.unmount();

    const reopened = renderHook(() => useUserSettings(), { wrapper: UserSettingsProvider });
    expect(reopened.result.current).toMatchObject({
      keepPanelOpen: true, hoverPreviewEnabled: false, sortMode: 'recently-used',
      appearanceMode: 'dark', hoverPreviewDelayMs: 450, allWindows: true,
    });
  });
});
