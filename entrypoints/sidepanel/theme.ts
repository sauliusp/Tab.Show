import { createTheme, Theme } from '@mui/material/styles';

// Extend the Material UI theme to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      preview: string;
      original: string;
      loading: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      preview?: string;
      original?: string;
      loading?: string;
    };
  }
}

// Custom color palette based on the specified colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#fa8334', // Orange
      light: '#fb9d5c',
      dark: '#e06a1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#388697', // Teal
      light: '#5a9ba8',
      dark: '#276b78',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#271033', // Dark purple
      secondary: '#5a4a5f',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    // Custom colors for specific use cases
    custom: {
      preview: '#388697', // Secondary color for preview state
      original: '#fa8334', // Primary color for original state
      loading: '#fa8334', // Primary color for loading state
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
            backgroundColor: 'rgba(250, 131, 52, 0.08)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(250, 131, 52, 0.04)',
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

// Apply CSS custom properties to document root for CSS access
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  root.style.setProperty('--mui-background-default', theme.palette.background.default);
  root.style.setProperty('--mui-text-primary', theme.palette.text.primary);
  root.style.setProperty('--mui-text-secondary', theme.palette.text.secondary);
  root.style.setProperty('--mui-primary-main', theme.palette.primary.main);
  root.style.setProperty('--mui-secondary-main', theme.palette.secondary.main);
  root.style.setProperty('--mui-custom-preview', theme.palette.custom.preview);
  root.style.setProperty('--mui-custom-original', theme.palette.custom.original);
  root.style.setProperty('--mui-custom-loading', theme.palette.custom.loading);
  root.style.setProperty('--mui-custom-preview-shadow', theme.palette.custom.preview + '66'); // 40% opacity
}

export default theme;
