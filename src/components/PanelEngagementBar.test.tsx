import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EXTENSION_URLS } from '../parameters';
import { PanelEngagementBar } from './PanelEngagementBar';

describe('PanelEngagementBar', () => {
  it('offers a usable Store link when clipboard access fails', async () => {
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')) },
    });

    render(<PanelEngagementBar />);
    fireEvent.click(screen.getByRole('button', { name: 'Tell a friend' }));

    expect(await screen.findByText('Could not access the clipboard')).toBeVisible();
    const recoveryLink = screen.getByRole('link', { name: 'Open the Chrome Web Store' });
    expect(recoveryLink).toHaveAttribute('href', EXTENSION_URLS.CHROME_WEB_STORE);
    expect(recoveryLink).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/copy the link from its address bar/i)).toBeVisible();
    expect(screen.queryByText(/from Settings/i)).not.toBeInTheDocument();
  });
});
