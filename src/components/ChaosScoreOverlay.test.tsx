import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChaosScoreOverlay } from './ChaosScoreOverlay';
import { calculateTabChaos } from '../utils/tabChaos';

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
});
