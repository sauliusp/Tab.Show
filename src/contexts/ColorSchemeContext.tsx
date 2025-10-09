import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { COLOR_PAIRINGS, ColorPairing, getColorPairingById } from '../constants/colorPairings';
import { userSettingsService } from '../services/UserSettingsService';
import { createAppTheme } from '../styles/theme';

interface ColorSchemeContextValue {
  colorPairing: ColorPairing;
  colorPairingId: string;
  setColorPairingById: (pairingId: string) => void;
  availablePairings: ColorPairing[];
}

const ColorSchemeContext = React.createContext<ColorSchemeContextValue | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorPairingId, setColorPairingId] = React.useState<string>(() => userSettingsService.getColorPairingId());

  React.useEffect(() => {
    userSettingsService.saveColorPairingId(colorPairingId);
  }, [colorPairingId]);

  const colorPairing = React.useMemo(
    () => getColorPairingById(colorPairingId),
    [colorPairingId]
  );

  const theme = React.useMemo(() => createAppTheme(colorPairing), [colorPairing]);

  const setColorPairingById = React.useCallback((pairingId: string) => {
    setColorPairingId(pairingId);
  }, []);

  const contextValue = React.useMemo<ColorSchemeContextValue>(() => ({
    colorPairing,
    colorPairingId,
    setColorPairingById,
    availablePairings: COLOR_PAIRINGS,
  }), [colorPairing, colorPairingId, setColorPairingById]);

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
