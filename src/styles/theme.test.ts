import { describe, expect, it } from 'vitest';
import { getContrastRatio } from '@mui/material/styles';
import { COLOR_PAIRINGS } from '../constants/colorPairings';
import { createAppTheme } from './theme';

describe('dark palette accessibility', () => {
  it.each(COLOR_PAIRINGS)('$name keeps active and preview rows distinct and readable', pairing => {
    const theme = createAppTheme(pairing, 'dark');

    expect(getContrastRatio(theme.palette.primary.main, theme.palette.background.paper)).toBeGreaterThanOrEqual(3);
    expect(getContrastRatio(theme.palette.secondary.main, theme.palette.background.paper)).toBeGreaterThanOrEqual(3);
    expect(getContrastRatio(theme.palette.primary.contrastText, theme.palette.primary.main)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(theme.palette.secondary.contrastText, theme.palette.secondary.main)).toBeGreaterThanOrEqual(4.5);
  });
});
