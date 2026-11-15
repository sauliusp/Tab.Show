import { describe, expect, it } from 'vitest';
import { shouldOpenReleaseNotes } from './releaseNotes';

describe('release notification policy', () => {
  it.each([
    ['2.3.0', '2.4.0', true],
    ['2.9.3', '3.0.0', true],
    ['2.4.0', '2.4.1', false],
    ['2.4.0', '2.4.0', false],
    ['2.4.0', '2.3.0', false],
    ['3.0.0', '2.9.0', false],
    [undefined, '2.4.0', false],
    ['invalid', '2.4.0', false],
  ])('%s to %s: show notes = %s', (previous, current, expected) => {
    expect(shouldOpenReleaseNotes(previous, current)).toBe(expected);
  });
});
