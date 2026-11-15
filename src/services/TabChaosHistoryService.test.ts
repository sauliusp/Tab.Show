import { describe, expect, it, vi } from 'vitest';
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
  it('localizes the current trend while retaining only numeric history', () => {
    const getMessage = vi.fn((key: string, substitutions?: string[]) => {
      if (key === 'panelLocale') return 'de';
      if (key === 'services_chaos_trend_first') return 'Erste lokale Messung.';
      if (key === 'services_chaos_trend_down_one') return `${substitutions?.[0]} Punkt weniger.`;
      return '';
    });
    vi.stubGlobal('browser', { i18n: { getMessage } });
    const dayOne = new Date(2026, 7, 29, 12).getTime();
    const first = tabChaosHistoryService.recordCheckIn({ ...stats(40, dayOne), score: 10 });
    const second = tabChaosHistoryService.recordCheckIn({ ...stats(30, dayOne + 86_400_000), score: 9 });

    expect(first.message).toBe('Erste lokale Messung.');
    expect(second.message).toBe('1 Punkt weniger.');
    const stored = JSON.parse(window.localStorage.getItem('tab.show.chaosHistory.v1')!);
    expect(stored.observations.map((observation: { score: number }) => observation.score)).toEqual([10, 9]);
    expect(stored.observations.every((observation: object) => !('message' in observation))).toBe(true);
    expect(stored.bestScore).toBe(9);
  });

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

  it('counts across a year boundary and resets after a missed day', () => {
    tabChaosHistoryService.recordCheckIn(stats(30, new Date(2025, 11, 31, 12).getTime()));
    const nextYear = tabChaosHistoryService.recordCheckIn(stats(30, new Date(2026, 0, 1, 12).getTime()));
    const afterGap = tabChaosHistoryService.recordCheckIn(stats(30, new Date(2026, 0, 3, 12).getTime()));

    expect(nextYear.checkInStreak).toBe(2);
    expect(afterGap.checkInStreak).toBe(1);
  });

  it('coalesces repeated same-day openings so a valid streak survives heavy use', () => {
    const dayOne = new Date(2026, 7, 28, 12).getTime();
    tabChaosHistoryService.recordCheckIn(stats(30, dayOne));
    tabChaosHistoryService.recordCheckIn(stats(35, dayOne + 86_400_000));
    tabChaosHistoryService.recordCheckIn(stats(40, dayOne + (2 * 86_400_000)));

    let latest = tabChaosHistoryService.recordCheckIn(stats(45, dayOne + (3 * 86_400_000)));
    for (let index = 1; index <= 100; index += 1) {
      latest = tabChaosHistoryService.recordCheckIn(stats(45 + (index % 3), dayOne + (3 * 86_400_000) + index));
    }

    expect(latest.checkInStreak).toBe(4);
  });
});
