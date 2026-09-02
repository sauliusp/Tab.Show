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

  it('keeps the all-time best after the observation window rolls over', () => {
    const start = new Date(2026, 0, 1, 12).getTime();
    const personalBest = tabChaosHistoryService.recordCheckIn(stats(1, start)).bestScore;
    let latest = tabChaosHistoryService.recordCheckIn(stats(150, start + 86_400_000));

    for (let index = 2; index <= 91; index += 1) {
      latest = tabChaosHistoryService.recordCheckIn(stats(150, start + (index * 86_400_000)));
    }

    expect(latest.bestScore).toBe(personalBest);
  });
});
