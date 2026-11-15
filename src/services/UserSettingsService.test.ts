import { describe, expect, it } from 'vitest';
import { userSettingsService } from './UserSettingsService';
import type { TabSortMode } from '../types/Tab';

describe('UserSettingsService appearance', () => {
  it('defaults to system and persists explicit light and dark choices', () => {
    expect(userSettingsService.getAppearanceMode()).toBe('system');
    userSettingsService.saveAppearanceMode('dark');
    expect(userSettingsService.getAppearanceMode()).toBe('dark');
    userSettingsService.saveAppearanceMode('light');
    expect(userSettingsService.getAppearanceMode()).toBe('light');
  });

  it('falls back to system for an invalid stored value', () => {
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({ appearanceMode: 'neon' }));
    expect(userSettingsService.getAppearanceMode()).toBe('system');
  });
});

describe('UserSettingsService switching preferences', () => {
  it('preserves existing settings when upgrading and keeps familiar defaults', () => {
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify({
      colorPairingId: 'custom-existing-pairing', allWindows: true, appearanceMode: 'dark', hoverPreviewDelayMs: 650,
    }));
    expect(userSettingsService.getKeepPanelOpen()).toBe(false);
    expect(userSettingsService.getHoverPreviewEnabled()).toBe(true);
    expect(userSettingsService.getSortMode()).toBe('current');

    userSettingsService.saveKeepPanelOpen(true);
    userSettingsService.saveHoverPreviewEnabled(false);
    userSettingsService.saveSortMode('domain');
    expect(userSettingsService.getColorPairingId()).toBe('custom-existing-pairing');
    expect(userSettingsService.getAllWindows()).toBe(true);
    expect(userSettingsService.getAppearanceMode()).toBe('dark');
    expect(userSettingsService.getHoverPreviewDelayMs()).toBe(650);
    expect(userSettingsService.getKeepPanelOpen()).toBe(true);
    expect(userSettingsService.getHoverPreviewEnabled()).toBe(false);
    expect(userSettingsService.getSortMode()).toBe('domain');
  });

  it.each<TabSortMode>(['current', 'recently-used', 'recently-opened', 'domain', 'group'])('persists %s sorting alongside behavior settings', (sortMode) => {
    userSettingsService.saveKeepPanelOpen(true);
    userSettingsService.saveHoverPreviewEnabled(false);
    userSettingsService.saveSortMode(sortMode);
    expect(userSettingsService.getSortMode()).toBe(sortMode);
    expect(userSettingsService.getKeepPanelOpen()).toBe(true);
    expect(userSettingsService.getHoverPreviewEnabled()).toBe(false);
  });

  it.each([null, [], 'domain', { keepPanelOpen: 'true', hoverPreviewEnabled: 0, sortMode: 'shuffle' }])('ignores invalid stored behavior values: %j', (stored) => {
    window.localStorage.setItem('tab.show.userSettings', JSON.stringify(stored));
    expect(userSettingsService.getKeepPanelOpen()).toBe(false);
    expect(userSettingsService.getHoverPreviewEnabled()).toBe(true);
    expect(userSettingsService.getSortMode()).toBe('current');
  });
});
