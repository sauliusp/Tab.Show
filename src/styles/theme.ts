import { createTheme, Theme, darken, lighten } from '@mui/material/styles';
import { ColorPairing, getDefaultColorPairing } from '../constants/colorPairings';

// Extend the Material UI theme to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      preview: string;
      original: string;
      loading: string;
      originalBackground: string;
      originalText: string;
      stale: string;
      error: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      preview?: string;
      original?: string;
      loading?: string;
      originalBackground?: string;
      originalText?: string;
      stale?: string;
      error?: string;
    };
  }
}

const BASE_BACKGROUND = '#ffffff';
const BASE_PAPER = '#f8f9fa';
const BASE_TEXT_PRIMARY = '#271033';
const BASE_TEXT_SECONDARY = '#5a4a5f';

export function createAppTheme(colorPairing: ColorPairing): Theme {
  const { colors } = colorPairing;

  const primaryLight = lighten(colors.primary, 0.15);
  const primaryDark = darken(colors.primary, 0.25);
  const secondaryLight = lighten(colors.secondary, 0.2);
  const secondaryDark = darken(colors.secondary, 0.2);
  const textDisabled = lighten(BASE_TEXT_SECONDARY, 0.45);

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: colors.primary,
        light: primaryLight,
        dark: primaryDark,
        contrastText: colors.textPrimary,
      },
      secondary: {
        main: colors.secondary,
        light: secondaryLight,
        dark: secondaryDark,
        contrastText: colors.textPrimary,
      },
      text: {
        primary: BASE_TEXT_PRIMARY,
        secondary: BASE_TEXT_SECONDARY,
        disabled: textDisabled,
      },
      background: {
        default: BASE_BACKGROUND,
        paper: BASE_PAPER,
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
        contrastText: '#ffffff',
      },
      custom: {
        preview: colors.secondary,
        original: colors.primary,
        loading: colors.primary,
        originalBackground: colors.primary,
        originalText: '#ffffff',
        stale: '#f59e0b',
        error: '#ef4444',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      body1: {
        fontSize: '0.875rem',
      },
      body2: {
        fontSize: '0.75rem',
      },
    },
    components: {
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: colors.primary + '14',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: colors.secondary + '1a',
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontSize: '0.75rem',
          },
        },
      },
    },
  });

  applyThemeCssVariables(theme);
  return theme;
}

export function applyThemeCssVariables(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty('--mui-background-default', theme.palette.background.default);
  root.style.setProperty('--mui-text-primary', theme.palette.text.primary);
  root.style.setProperty('--mui-text-secondary', theme.palette.text.secondary);
  root.style.setProperty('--mui-primary-main', theme.palette.primary.main);
  root.style.setProperty('--mui-secondary-main', theme.palette.secondary.main);
  root.style.setProperty('--mui-custom-preview', theme.palette.custom.preview);
  root.style.setProperty('--mui-custom-original', theme.palette.custom.original);
  root.style.setProperty('--mui-custom-loading', theme.palette.custom.loading);
  root.style.setProperty('--mui-custom-original-background', theme.palette.custom.originalBackground);
  root.style.setProperty('--mui-custom-original-text', theme.palette.custom.originalText);
  root.style.setProperty('--mui-custom-stale', theme.palette.custom.stale);
  root.style.setProperty('--mui-custom-error', theme.palette.custom.error);
  root.style.setProperty('--mui-custom-preview-shadow', theme.palette.custom.preview + '66');
}

export function getDefaultTheme(): Theme {
  return createAppTheme(getDefaultColorPairing());
}
