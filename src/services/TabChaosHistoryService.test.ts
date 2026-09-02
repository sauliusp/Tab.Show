import { describe, expect, it } from 'vitest';
import { tabChaosHistoryService } from './TabChaosHistoryService';
import { calculateTabChaos } from '../utils/tabChaos';

function stats(scoreSize: number, timestamp: number) {
  return calculateTabChaos(
    Array.from({ length: scoreSize }, (_, index) => ({ id: index + 1, index, windowId: 1, url: `https://example.com/${index}` })),
    [],
    { now: timestamp, currentWindowId: 1, currentTabId: 1 },
  );
}

describe('TabChaosHistoryService', () => {
  it('keeps local progress, a personal best, and a consecutive-day check-in streak', () => {
    const dayOne = new Date(2026, 7, 29, 12).getTime();
    const dayTwo = new Date(2026, 7, 30, 12).getTime();
    const dayThree = new Date(2026, 7, 31, 12).getTime();

    const first = tabChaosHistoryService.recordCheckIn(stats(80, dayOne));
    const second = tabChaosHistoryService.recordCheckIn(stats(30, dayTwo));
    const third = tabChaosHistoryService.recordCheckIn(stats(40, dayThree));

    expect(first.previousScore).toBeNull();
    expect(second.scoreDelta).toBeLessThan(0);
    expect(second.message).toMatch(/^Down /);
    expect(third.checkInStreak).toBe(3);
    expect(third.bestScore).toBe(second.previousScore! + second.scoreDelta!);
  });
});
