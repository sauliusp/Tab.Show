import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, getContrastRatio } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';
import { ChaosScoreOverlay } from './ChaosScoreOverlay';
import { calculateTabChaos } from '../utils/tabChaos';
import { getDefaultColorPairing } from '../constants/colorPairings';
import { createAppTheme } from '../styles/theme';

describe('ChaosScoreOverlay', () => {
  it('focuses its close control, closes with Escape, and restores focus', async () => {
    const onClose = vi.fn();
    const stats = calculateTabChaos(
      Array.from({ length: 45 }, (_, index) => ({ id: index + 1, index, windowId: 1, url: `https://example.com/${index}` })),
      [],
      { currentWindowId: 1, currentTabId: 1 },
    );
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const { rerender } = render(<ChaosScoreOverlay open onClose={onClose} stats={stats} trend={null} />);
    const closeButton = await screen.findByRole('button', { name: 'Close Tab Chaos Score' });
    await waitFor(() => expect(closeButton).toHaveFocus());

    fireEvent.keyDown(closeButton, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    rerender(<ChaosScoreOverlay open={false} onClose={onClose} stats={stats} trend={null} />);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
    opener.remove();
  });

  it.each(['light', 'dark'] as const)(
    'keeps every severity label readable on the %s drawer background',
    (mode) => {
      const theme = createAppTheme(getDefaultColorPairing(), mode);
      const baseStats = calculateTabChaos([], [], { currentWindowId: 1, currentTabId: 1 });
      const severities = [
        { score: 0, level: 'Clear skies' },
        { score: 20, level: 'Lively' },
        { score: 40, level: 'Busy' },
        { score: 60, level: 'Wild' },
        { score: 80, level: 'Maximum chaos' },
      ] as const;

      severities.forEach(({ score, level }) => {
        const { unmount } = render(
          <ThemeProvider theme={theme}>
            <ChaosScoreOverlay
              open
              onClose={vi.fn()}
              stats={{ ...baseStats, score, level }}
              trend={null}
            />
          </ThemeProvider>,
        );
        const label = screen.getByText(level);
        const labelColor = window.getComputedStyle(label).color;

        expect(label).toHaveTextContent(level);
        expect(getContrastRatio(labelColor, theme.palette.background.paper)).toBeGreaterThanOrEqual(4.5);
        unmount();
      });
    },
  );
});
