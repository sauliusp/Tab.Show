import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorSchemeProvider } from '../contexts/ColorSchemeContext';
import { TabItem } from './TabItem';

describe('TabItem pointer and keyboard modality', () => {
  it('does not let a stationary pointer steal keyboard navigation, then resumes on real movement', () => {
    const onTabHover = vi.fn();
    const onPointerIntent = vi.fn();
    render(
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
    );

    const row = screen.getByTitle('https://target.example');
    fireEvent.mouseEnter(row);
    expect(onPointerIntent).not.toHaveBeenCalled();
    expect(onTabHover).not.toHaveBeenCalled();

    fireEvent.mouseMove(row);
    expect(onPointerIntent).toHaveBeenCalledWith(7);
    expect(row).toHaveAttribute('aria-current', 'true');
  });
});
