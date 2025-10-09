import { ColorPairing, DEFAULT_COLOR_PAIRING_ID, getColorPairingById } from '../constants/colorPairings';

const STORAGE_KEY = 'tab.show.userSettings';

export interface UserSettings {
  colorPairingId: string;
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

  private readSettings(): UserSettings | null {
    if (!this.storageAvailable) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<UserSettings> & { colorPairing?: { id?: string } };
      if (parsed && typeof parsed.colorPairingId === 'string') {
        return { colorPairingId: parsed.colorPairingId };
      }
      if (parsed?.colorPairing?.id) {
        return { colorPairingId: parsed.colorPairing.id };
      }
      return null;
    } catch (error) {
      console.warn('Failed to parse user settings from localStorage, falling back to defaults.', error);
      return null;
    }
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
    const storedSettings = this.readSettings();
    return storedSettings?.colorPairingId ?? DEFAULT_COLOR_PAIRING_ID;
  }

  saveColorPairingId(colorPairingId: string): void {
    this.writeSettings({ colorPairingId });
  }
}

export const userSettingsService = UserSettingsService.getInstance();
