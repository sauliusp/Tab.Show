import { describe, expect, it } from 'vitest';
import { userSettingsService } from './UserSettingsService';

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
