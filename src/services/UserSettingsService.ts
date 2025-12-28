import { ColorPairing, DEFAULT_COLOR_PAIRING_ID, getColorPairingById } from '../constants/colorPairings';

const STORAGE_KEY = 'tab.show.userSettings';
export const DEFAULT_HOVER_PREVIEW_DELAY_MS = 250;

export interface UserSettings {
  colorPairingId: string;
  hoverPreviewDelayMs: number;
}

class UserSettingsService {
  private static instance: UserSettingsService;
  private storageAvailable: boolean;

  private constructor() {
    this.storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  static getInstance(): UserSettingsService {
    if (!UserSettingsService.instance) {
      UserSettingsService.instance = new UserSettingsService();
    }
    return UserSettingsService.instance;
  }

  private getDefaultSettings(): UserSettings {
    return {
      colorPairingId: DEFAULT_COLOR_PAIRING_ID,
      hoverPreviewDelayMs: DEFAULT_HOVER_PREVIEW_DELAY_MS
    };
  }

  private readSettings(): Partial<UserSettings> | null {
    if (!this.storageAvailable) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<UserSettings> & { colorPairing?: { id?: string } };
      const settings: Partial<UserSettings> = {};

      if (parsed && typeof parsed.colorPairingId === 'string') {
        settings.colorPairingId = parsed.colorPairingId;
      } else if (parsed?.colorPairing?.id) {
        settings.colorPairingId = parsed.colorPairing.id;
      }

      if (typeof parsed?.hoverPreviewDelayMs === 'number' && Number.isFinite(parsed.hoverPreviewDelayMs) && parsed.hoverPreviewDelayMs >= 0) {
        settings.hoverPreviewDelayMs = parsed.hoverPreviewDelayMs;
      }

      return Object.keys(settings).length ? settings : null;
    } catch (error) {
      console.warn('Failed to parse user settings from localStorage, falling back to defaults.', error);
      return null;
    }
  }

  private getSettings(): UserSettings {
    const storedSettings = this.readSettings();
    return {
      ...this.getDefaultSettings(),
      ...(storedSettings ?? {})
    };
  }

  private normalizeHoverPreviewDelayMs(delayMs: number): number {
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      return DEFAULT_HOVER_PREVIEW_DELAY_MS;
    }

    return Math.round(delayMs);
  }

  private writeSettings(settings: UserSettings): void {
    if (!this.storageAvailable) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to persist user settings:', error);
    }
  }

  getColorPairing(): ColorPairing {
    const id = this.getColorPairingId();
    return getColorPairingById(id);
  }

  getColorPairingId(): string {
    return this.getSettings().colorPairingId;
  }

  getHoverPreviewDelayMs(): number {
    return this.getSettings().hoverPreviewDelayMs;
  }

  saveColorPairingId(colorPairingId: string): void {
    const currentSettings = this.getSettings();
    this.writeSettings({
      ...currentSettings,
      colorPairingId
    });
  }

  saveHoverPreviewDelayMs(hoverPreviewDelayMs: number): void {
    const currentSettings = this.getSettings();
    this.writeSettings({
      ...currentSettings,
      hoverPreviewDelayMs: this.normalizeHoverPreviewDelayMs(hoverPreviewDelayMs)
    });
  }
}

export const userSettingsService = UserSettingsService.getInstance();
