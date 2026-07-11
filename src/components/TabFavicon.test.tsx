import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TabFavicon, getFaviconCandidates } from './TabFavicon';

describe('TabFavicon', () => {
  it('falls back from the tab favicon to Chrome favicon cache, then to an initial', () => {
    vi.stubGlobal('browser', { runtime: { getURL: (path: string) => `chrome-extension://test${path}` } });
    const tab = { id: 1, title: 'Example', url: 'https://example.com/page', favIconUrl: 'https://broken.example/icon.png' };
    const candidates = getFaviconCandidates(tab);
    expect(candidates).toHaveLength(2);
    expect(candidates[1]).toContain('/_favicon/?pageUrl=https%3A%2F%2Fexample.com%2Fpage&size=32');

    render(<TabFavicon tab={tab}>E</TabFavicon>);
    const image = screen.getByRole('img', { name: 'Example' });
    expect(image).toHaveAttribute('src', candidates[0]);
    fireEvent.error(image);
    expect(screen.getByRole('img', { name: 'Example' })).toHaveAttribute('src', candidates[1]);
    fireEvent.error(screen.getByRole('img', { name: 'Example' }));
    expect(screen.getByText('E')).toBeVisible();
  });
});
