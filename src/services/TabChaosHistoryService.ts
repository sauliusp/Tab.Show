import type { TabChaosStats } from '../utils/tabChaos';

const STORAGE_KEY = 'tab.show.chaosHistory.v1';
const MAX_OBSERVATIONS = 90;

interface ChaosObservation {
  timestamp: number;
  day: string;
  score: number;
  tabCount: number;
}

interface StoredChaosHistory {
  observations: ChaosObservation[];
  bestScore: number | null;
}

export interface ChaosTrend {
  previousScore: number | null;
  scoreDelta: number | null;
  tabsDelta: number | null;
  bestScore: number;
  checkInStreak: number;
  message: string;
}

function localDay(timestamp: number): string {
  const date = new Date(timestamp);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function dayNumber(day: string): number {
  const [year = NaN, month = NaN, date = NaN] = day.split('-').map(Number);
  return Date.UTC(year, month - 1, date) / 86_400_000;
}

function calculateStreak(observations: ChaosObservation[], today: string): number {
  const days = [...new Set(observations.map(observation => observation.day))]
    .sort((a, b) => dayNumber(b) - dayNumber(a));
  if (!days.length || days[0] !== today) return 0;
  let streak = 1;
  let previousDay = dayNumber(today);
  for (const day of days.slice(1)) {
    const currentDay = dayNumber(day);
    if (previousDay - currentDay !== 1) break;
    streak += 1;
    previousDay = currentDay;
  }
  return streak;
}

class TabChaosHistoryService {
  private read(): StoredChaosHistory {
    if (typeof window === 'undefined' || !window.localStorage) return { observations: [], bestScore: null };
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<StoredChaosHistory>;
      const observations = Array.isArray(parsed.observations) ? parsed.observations.filter(Boolean) : [];
      const retainedBest = observations.length > 0
        ? Math.min(...observations.map(observation => observation.score))
        : null;
      return {
        observations,
        bestScore: typeof parsed.bestScore === 'number' && Number.isFinite(parsed.bestScore)
          ? parsed.bestScore
          : retainedBest,
      };
    } catch {
      return { observations: [], bestScore: null };
    }
  }

  recordCheckIn(stats: TabChaosStats): ChaosTrend {
    const history = this.read();
    const previous = history.observations.at(-1) ?? null;
    const observation: ChaosObservation = {
      timestamp: stats.calculatedAt,
      day: localDay(stats.calculatedAt),
      score: stats.score,
      tabCount: stats.totalTabs,
    };
    const observations = (previous?.day === observation.day
      ? [...history.observations.slice(0, -1), observation]
      : [...history.observations, observation]
    ).slice(-MAX_OBSERVATIONS);
    const bestScore = history.bestScore === null
      ? stats.score
      : Math.min(history.bestScore, stats.score);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ observations, bestScore } satisfies StoredChaosHistory));
    } catch {
      // The score still works when extension storage is unavailable.
    }

    const scoreDelta = previous ? stats.score - previous.score : null;
    const tabsDelta = previous ? stats.totalTabs - previous.tabCount : null;
    const message = scoreDelta === null
      ? 'First local check-in. This becomes more useful over time.'
      : scoreDelta < 0
        ? `Down ${Math.abs(scoreDelta)} point${Math.abs(scoreDelta) === 1 ? '' : 's'} since your last check.`
        : scoreDelta > 0
          ? `Up ${scoreDelta} point${scoreDelta === 1 ? '' : 's'} since your last check.`
          : 'Steady since your last check.';

    return {
      previousScore: previous?.score ?? null,
      scoreDelta,
      tabsDelta,
      bestScore,
      checkInStreak: calculateStreak(observations, observation.day),
      message,
    };
  }
}

export const tabChaosHistoryService = new TabChaosHistoryService();
