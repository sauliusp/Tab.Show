import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { COLOR_PAIRINGS, ColorPairing, getColorPairingById } from '../constants/colorPairings';
import { userSettingsService } from '../services/UserSettingsService';
import { createAppTheme } from '../styles/theme';
import { useUserSettings } from './UserSettingsContext';

interface ColorSchemeContextValue {
  colorPairing: ColorPairing;
  colorPairingId: string;
  setColorPairingById: (pairingId: string) => void;
  availablePairings: ColorPairing[];
  resolvedMode: 'light' | 'dark';
}

const ColorSchemeContext = React.createContext<ColorSchemeContextValue | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const { appearanceMode } = useUserSettings();
  const [colorPairingId, setColorPairingId] = React.useState<string>(() => userSettingsService.getColorPairingId());
  const [systemPrefersDark, setSystemPrefersDark] = React.useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  ));

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    setSystemPrefersDark(query.matches);
    query.addEventListener?.('change', handleChange);
    return () => query.removeEventListener?.('change', handleChange);
  }, []);

  React.useEffect(() => {
    userSettingsService.saveColorPairingId(colorPairingId);
  }, [colorPairingId]);

  const colorPairing = React.useMemo(
    () => getColorPairingById(colorPairingId),
    [colorPairingId]
  );

  const resolvedMode = appearanceMode === 'system'
    ? (systemPrefersDark ? 'dark' : 'light')
    : appearanceMode;

  const theme = React.useMemo(() => createAppTheme(colorPairing, resolvedMode), [colorPairing, resolvedMode]);

  React.useEffect(() => {
    document.documentElement.dataset.colorScheme = resolvedMode;
    document.documentElement.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const setColorPairingById = React.useCallback((pairingId: string) => {
    setColorPairingId(pairingId);
  }, []);

  const contextValue = React.useMemo<ColorSchemeContextValue>(() => ({
    colorPairing,
    colorPairingId,
    setColorPairingById,
    availablePairings: COLOR_PAIRINGS,
    resolvedMode,
  }), [colorPairing, colorPairingId, setColorPairingById, resolvedMode]);

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme(): ColorSchemeContextValue {
  const context = React.useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
}
