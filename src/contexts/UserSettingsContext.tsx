import React from 'react';
import { type AppearanceMode, DEFAULT_HOVER_PREVIEW_DELAY_MS, userSettingsService } from '../services/UserSettingsService';
import type { TabSortMode } from '../types/Tab';

interface UserSettingsContextValue {
  hoverPreviewDelayMs: number;
  setHoverPreviewDelayMs: (delayMs: number) => void;
  allWindows: boolean;
  setAllWindows: (allWindows: boolean) => void;
  appearanceMode: AppearanceMode;
  setAppearanceMode: (appearanceMode: AppearanceMode) => void;
  keepPanelOpen: boolean;
  setKeepPanelOpen: (keepPanelOpen: boolean) => void;
  hoverPreviewEnabled: boolean;
  setHoverPreviewEnabled: (hoverPreviewEnabled: boolean) => void;
  sortMode: TabSortMode;
  setSortMode: (sortMode: TabSortMode) => void;
}

const UserSettingsContext = React.createContext<UserSettingsContextValue | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [hoverPreviewDelayMs, setHoverPreviewDelayMsState] = React.useState<number>(() => (
    userSettingsService.getHoverPreviewDelayMs()
  ));
  const [allWindows, setAllWindows] = React.useState<boolean>(() => userSettingsService.getAllWindows());
  const [appearanceMode, setAppearanceMode] = React.useState<AppearanceMode>(() => userSettingsService.getAppearanceMode());
  const [keepPanelOpen, setKeepPanelOpen] = React.useState(() => userSettingsService.getKeepPanelOpen());
  const [hoverPreviewEnabled, setHoverPreviewEnabled] = React.useState(() => userSettingsService.getHoverPreviewEnabled());
  const [sortMode, setSortMode] = React.useState<TabSortMode>(() => userSettingsService.getSortMode());

  React.useEffect(() => {
    userSettingsService.saveHoverPreviewDelayMs(hoverPreviewDelayMs);
  }, [hoverPreviewDelayMs]);

  React.useEffect(() => {
    userSettingsService.saveAllWindows(allWindows);
  }, [allWindows]);

  React.useEffect(() => {
    userSettingsService.saveAppearanceMode(appearanceMode);
  }, [appearanceMode]);

  React.useEffect(() => {
    userSettingsService.saveKeepPanelOpen(keepPanelOpen);
  }, [keepPanelOpen]);

  React.useEffect(() => {
    userSettingsService.saveHoverPreviewEnabled(hoverPreviewEnabled);
  }, [hoverPreviewEnabled]);

  React.useEffect(() => {
    userSettingsService.saveSortMode(sortMode);
  }, [sortMode]);

  const setHoverPreviewDelayMs = React.useCallback((delayMs: number) => {
    const safeDelayMs = Number.isFinite(delayMs)
      ? Math.max(0, Math.round(delayMs))
      : DEFAULT_HOVER_PREVIEW_DELAY_MS;

    setHoverPreviewDelayMsState(safeDelayMs);
  }, []);

  const contextValue = React.useMemo<UserSettingsContextValue>(() => ({
    hoverPreviewDelayMs,
    setHoverPreviewDelayMs,
    allWindows,
    setAllWindows,
    appearanceMode,
    setAppearanceMode,
    keepPanelOpen,
    setKeepPanelOpen,
    hoverPreviewEnabled,
    setHoverPreviewEnabled,
    sortMode,
    setSortMode,
  }), [hoverPreviewDelayMs, setHoverPreviewDelayMs, allWindows, appearanceMode, keepPanelOpen, hoverPreviewEnabled, sortMode]);

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings(): UserSettingsContextValue {
  const context = React.useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}
