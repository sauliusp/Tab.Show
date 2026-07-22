import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TabFavicon, getFaviconCandidates } from './TabFavicon';

describe('TabFavicon', () => {
  it('falls back from the tab favicon to an initial', () => {
    const tab = { id: 1, title: 'Example', url: 'https://example.com/page', favIconUrl: 'https://broken.example/icon.png' };
    const candidates = getFaviconCandidates(tab);
    expect(candidates).toEqual([tab.favIconUrl]);

    render(<TabFavicon tab={tab}>E</TabFavicon>);
    const image = screen.getByRole('img', { name: 'Example' });
    expect(image).toHaveAttribute('src', candidates[0]);
    fireEvent.error(image);
    expect(screen.getByText('E')).toBeVisible();
  });
});
