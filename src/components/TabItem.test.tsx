import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorSchemeProvider } from '../contexts/ColorSchemeContext';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';
import { TabItem } from './TabItem';

const fixtureTab = { id: 7, windowId: 10, index: 0, title: 'Keyboard target', url: 'https://target.example' };

function Providers({ children }: { children: React.ReactNode }) {
  return <UserSettingsProvider><ColorSchemeProvider>{children}</ColorSchemeProvider></UserSettingsProvider>;
}

describe('TabItem pointer and keyboard modality', () => {
  it('does not let a stationary pointer steal keyboard navigation, then resumes on real movement', () => {
    const onTabHover = vi.fn();
    const onPointerIntent = vi.fn();
    render(
      <UserSettingsProvider>
        <ColorSchemeProvider>
          <TabItem
            tab={{ id: 7, windowId: 10, index: 0, title: 'Keyboard target', url: 'https://target.example' }}
            previewTabId={null}
            originalTab={null}
            onTabHover={onTabHover}
            onTabClick={vi.fn()}
            onCloseTab={vi.fn()}
            highlighted
            pointerPreviewEnabled={false}
            onPointerIntent={onPointerIntent}
          />
        </ColorSchemeProvider>
      </UserSettingsProvider>
    );

    const row = screen.getByTitle('https://target.example');
    fireEvent.mouseEnter(row);
    expect(onPointerIntent).not.toHaveBeenCalled();
    expect(onTabHover).not.toHaveBeenCalled();

    fireEvent.mouseMove(row);
    expect(onPointerIntent).toHaveBeenCalledWith(7);
    expect(row).toHaveAttribute('aria-selected', 'true');
  });

  it('does not preview or show a waiting spinner when hover preview is disabled', () => {
    const onTabHover = vi.fn();
    render(<TabItem tab={fixtureTab} originalTab={null} previewTabId={null} onTabHover={onTabHover} onTabClick={vi.fn()} onCloseTab={vi.fn()} hoverPreviewEnabled={false} />, { wrapper: Providers });
    fireEvent.mouseEnter(screen.getByRole('row'));
    expect(onTabHover).not.toHaveBeenCalled();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('uses replacement callbacks even when the tab data is unchanged', () => {
    const oldClick = vi.fn();
    const newClick = vi.fn();
    const oldHover = vi.fn();
    const newHover = vi.fn();
    const oldClose = vi.fn();
    const newClose = vi.fn();
    const first = render(<TabItem tab={fixtureTab} originalTab={null} previewTabId={null} onTabHover={oldHover} onTabClick={oldClick} onCloseTab={oldClose} />, { wrapper: Providers });
    first.rerender(<TabItem tab={fixtureTab} originalTab={null} previewTabId={null} onTabHover={newHover} onTabClick={newClick} onCloseTab={newClose} />);
    fireEvent.mouseEnter(screen.getByRole('row'));
    fireEvent.click(screen.getByRole('button', { name: /Open Keyboard target,/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Close tab' }));
    expect(newHover).toHaveBeenCalledWith(7);
    expect(newClick).toHaveBeenCalledTimes(1);
    expect(newClose).toHaveBeenCalledWith(7);
    expect(oldHover).not.toHaveBeenCalled();
    expect(oldClick).not.toHaveBeenCalled();
    expect(oldClose).not.toHaveBeenCalled();
  });

  it('exposes separate keyboard actions for opening and closing a tab', () => {
    const onTabClick = vi.fn();
    const onCloseTab = vi.fn();
    render(<TabItem tab={fixtureTab} originalTab={null} previewTabId={null} onTabHover={vi.fn()} onTabClick={onTabClick} onCloseTab={onCloseTab} />, { wrapper: Providers });
    const open = screen.getByRole('button', { name: /Open Keyboard target,/ });
    const close = screen.getByRole('button', { name: 'Close tab' });
    expect(open).not.toContainElement(close);
    fireEvent.keyDown(open, { key: 'Enter' });
    expect(onTabClick).toHaveBeenCalledWith(7);
    fireEvent.click(close);
    expect(onCloseTab).toHaveBeenCalledWith(7);
    expect(onTabClick).toHaveBeenCalledTimes(1);
  });
});
