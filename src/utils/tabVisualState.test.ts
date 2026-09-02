import { getContrastRatio } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';
import { COLOR_PAIRINGS } from '../constants/colorPairings';
import { createAppTheme } from '../styles/theme';
import { clearVisualStateCache, getTabVisualState } from './tabVisualState';

describe('getTabVisualState', () => {
  it.each(['light', 'dark'] as const)(
    'keeps original-tab hover backgrounds opaque and readable in %s mode',
    mode => {
      for (const pairing of COLOR_PAIRINGS) {
        clearVisualStateCache();
        const theme = createAppTheme(pairing, mode);
        const originalTab = {
          id: 7,
          title: 'Original tab',
          url: 'https://example.com',
        };

        const visualState = getTabVisualState(originalTab, null, originalTab, theme);
        const hoverBackground = visualState.hoverStyles.backgroundColor as string;

        expect(hoverBackground).toBe(theme.palette.custom.originalBackground);
        expect(hoverBackground).not.toMatch(/[0-9a-f]{8}$/i);
        expect(getContrastRatio(visualState.textColor, hoverBackground)).toBeGreaterThanOrEqual(4.5);
      }
    }
  );
});
