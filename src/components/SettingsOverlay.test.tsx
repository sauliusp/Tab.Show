import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SettingsOverlay } from './SettingsOverlay';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';
import { ColorSchemeProvider } from '../contexts/ColorSchemeContext';
import { userSettingsService } from '../services/UserSettingsService';

function SettingsHarness({ onOutsideKeyDown = () => {} }: { onOutsideKeyDown?: React.KeyboardEventHandler }) {
  const [open, setOpen] = React.useState(false);
  return <UserSettingsProvider><ColorSchemeProvider>
    <div onKeyDown={onOutsideKeyDown}>
      <button onClick={() => setOpen(true)}>Open settings</button>
      <SettingsOverlay open={open} onClose={() => setOpen(false)} />
    </div>
  </ColorSchemeProvider></UserSettingsProvider>;
}

describe('SettingsOverlay behavior and keyboard access', () => {
  it('saves switching choices and disables the delay control while hover preview is off', async () => {
    const user = userEvent.setup();
    render(<SettingsHarness />);
    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    const keepOpen = screen.getByRole('switch', { name: 'Keep panel open after choosing a tab' });
    const preview = screen.getByRole('switch', { name: 'Preview tabs on hover' });
    const delay = screen.getByRole('slider', { name: 'Hover preview delay in milliseconds' });
    expect(keepOpen).not.toBeChecked();
    expect(preview).toBeChecked();
    await user.click(keepOpen);
    await user.click(preview);
    expect(userSettingsService.getKeepPanelOpen()).toBe(true);
    expect(userSettingsService.getHoverPreviewEnabled()).toBe(false);
    expect(delay).toBeDisabled();
    await user.click(preview);
    expect(delay).not.toBeDisabled();
    expect(userSettingsService.getHoverPreviewEnabled()).toBe(true);
  });

  it('traps focus, closes on Escape from a link without triggering panel shortcuts, and restores the opener', async () => {
    const user = userEvent.setup();
    const outsideKeyDown = vi.fn();
    render(<SettingsHarness onOutsideKeyDown={outsideKeyDown} />);
    const opener = screen.getByRole('button', { name: 'Open settings' });
    await user.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    const close = within(dialog).getByRole('button', { name: 'Close settings' });
    const done = within(dialog).getByRole('button', { name: 'Done' });
    close.focus();
    await user.tab({ shift: true });
    expect(done).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    within(dialog).getByRole('link', { name: 'What’s new' }).focus();
    await user.keyboard('{Escape}');
    expect(outsideKeyDown).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
  });

  it('shows the installed manifest version and packaged help pages', async () => {
    vi.stubGlobal('browser', { runtime: {
      getManifest: () => ({ version: '2.4.0' }),
      getURL: (path: string) => `chrome-extension://test${path}`,
    } });
    const user = userEvent.setup();
    render(<SettingsHarness />);
    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(screen.getByText('About TabShow 2.4.0')).toBeVisible();
    expect(screen.getByRole('link', { name: 'What’s new' })).toHaveAttribute('href', 'chrome-extension://test/pages/whats-new/index.html');
    expect(screen.getByRole('link', { name: 'Getting started' })).toHaveAttribute('href', 'chrome-extension://test/pages/welcome/index.html');
    expect(screen.getByText(/Chrome’s pin button only pins the toolbar icon/)).toBeVisible();
    expect(screen.getByText(/does not copy custom Chrome theme colors/)).toBeVisible();
  });
});
