import { createTheme, Theme, darken, getContrastRatio, lighten } from '@mui/material/styles';
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

const LIGHT_BACKGROUND = '#ffffff';
const LIGHT_PAPER = '#f8f9fa';
const LIGHT_TEXT_PRIMARY = '#271033';
const LIGHT_TEXT_SECONDARY = '#5a4a5f';
const DARK_BACKGROUND = '#101117';
const DARK_PAPER = '#191b24';
const DARK_TEXT_PRIMARY = '#f5f2f8';
const DARK_TEXT_SECONDARY = '#b8b2c4';
const DARK_ACCENT_TEXT = '#11131a';

function ensureAccentContrast(color: string, background: string, minimumContrast = 3): string {
  if (getContrastRatio(color, background) >= minimumContrast) {
    return color;
  }

  for (const amount of [0.12, 0.2, 0.28, 0.36, 0.44, 0.52]) {
    const candidate = lighten(color, amount);
    if (getContrastRatio(candidate, background) >= minimumContrast) {
      return candidate;
    }
  }

  return lighten(color, 0.6);
}

function getReadableAccentText(background: string): string {
  return getContrastRatio(background, '#ffffff') >= getContrastRatio(background, DARK_ACCENT_TEXT)
    ? '#ffffff'
    : DARK_ACCENT_TEXT;
}

export function createAppTheme(colorPairing: ColorPairing, mode: 'light' | 'dark' = 'light'): Theme {
  const { colors } = colorPairing;
  const isDark = mode === 'dark';
  const background = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  const paper = isDark ? DARK_PAPER : LIGHT_PAPER;
  const primaryMain = isDark ? ensureAccentContrast(colors.primary, paper) : colors.primary;
  const secondaryMain = isDark ? ensureAccentContrast(colors.secondary, paper) : colors.secondary;
  const primaryContrastText = getReadableAccentText(primaryMain);
  const secondaryContrastText = getReadableAccentText(secondaryMain);
  const textPrimary = isDark ? DARK_TEXT_PRIMARY : LIGHT_TEXT_PRIMARY;
  const textSecondary = isDark ? DARK_TEXT_SECONDARY : LIGHT_TEXT_SECONDARY;

  const primaryLight = lighten(primaryMain, 0.15);
  const primaryDark = darken(primaryMain, 0.25);
  const secondaryLight = lighten(secondaryMain, 0.2);
  const secondaryDark = darken(secondaryMain, 0.2);
  const textDisabled = isDark ? darken(textSecondary, 0.3) : lighten(textSecondary, 0.45);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: primaryContrastText,
      },
      secondary: {
        main: secondaryMain,
        light: secondaryLight,
        dark: secondaryDark,
        contrastText: secondaryContrastText,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
        disabled: textDisabled,
      },
      background: {
        default: background,
        paper,
      },
      divider: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(39,16,51,0.12)',
      action: {
        hover: isDark ? 'rgba(255,255,255,0.065)' : 'rgba(44,42,74,0.055)',
        selected: isDark ? 'rgba(255,255,255,0.11)' : 'rgba(44,42,74,0.10)',
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
        preview: secondaryMain,
        original: primaryMain,
        loading: primaryMain,
        originalBackground: primaryMain,
        originalText: primaryContrastText,
        stale: '#f59e0b',
        error: '#ef4444',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif',
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
  root.style.setProperty('--mui-background-paper', theme.palette.background.paper);
  root.style.setProperty('--mui-text-primary', theme.palette.text.primary);
  root.style.setProperty('--mui-text-secondary', theme.palette.text.secondary);
  root.style.setProperty('--mui-primary-main', theme.palette.primary.main);
  root.style.setProperty('--mui-secondary-main', theme.palette.secondary.main);
  root.style.setProperty('--mui-divider', theme.palette.divider);
  root.style.setProperty('--mui-scrollbar-track', theme.palette.mode === 'dark' ? '#14161d' : '#f1f5f9');
  root.style.setProperty('--mui-scrollbar-thumb', theme.palette.mode === 'dark' ? '#4b5060' : '#cbd5e1');
  root.style.setProperty('--mui-scrollbar-thumb-hover', theme.palette.mode === 'dark' ? '#656b7d' : '#94a3b8');
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
