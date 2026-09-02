import React from 'react';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { darken } from '@mui/material/styles';
import InsightsRounded from '@mui/icons-material/InsightsRounded';
import { ChaosTrend } from '../services/TabChaosHistoryService';
import { getChaosScoreColor, TabChaosStats } from '../utils/tabChaos';
import { getReadableTextColor } from '../utils/colorContrast';

interface ChaosScoreButtonProps {
  stats: TabChaosStats | null;
  trend: ChaosTrend | null;
  isLoading: boolean;
  onOpen: () => void;
}

export function ChaosScoreButton({ stats, trend, isLoading, onOpen }: ChaosScoreButtonProps) {
  const score = stats?.score ?? 0;
  const scoreColor = getChaosScoreColor(score);
  const scoreTextColor = getReadableTextColor(scoreColor);
  const trendLabel = trend?.scoreDelta == null
    ? 'Start your trend'
    : trend.scoreDelta < 0
      ? `${Math.abs(trend.scoreDelta)} lower than last check`
      : trend.scoreDelta > 0
        ? `${trend.scoreDelta} higher than last check`
        : 'No change since last check';
  const label = stats
    ? `Open Tab Chaos Score: ${score}, ${stats.level}`
    : 'Open Tab Chaos Score';
  const tooltip = stats
    ? `Tab chaos ${score}/100 · ${stats.level} · ${trendLabel}`
    : 'Calculating Tab Chaos Score…';

  return (
    <Tooltip title={tooltip} placement="bottom-end">
      <span style={{ display: 'inline-grid' }}>
        <IconButton
          aria-label={label}
          data-chaos-color={scoreColor}
          disabled={!stats || isLoading}
          onClick={onOpen}
          sx={{
            width: 40,
            height: 40,
            p: 0,
            border: 1,
            borderColor: stats ? scoreColor : 'divider',
            borderRadius: 1.5,
            color: stats ? scoreTextColor : 'text.secondary',
            backgroundColor: stats ? scoreColor : 'background.paper',
            boxShadow: stats ? `0 2px 8px ${scoreColor}42` : 'none',
            '&:hover': {
              backgroundColor: stats ? darken(scoreColor, 0.08) : 'action.hover',
              borderColor: stats ? darken(scoreColor, 0.08) : 'divider',
            },
            '&.Mui-disabled': {
              color: stats ? scoreTextColor : 'text.disabled',
              backgroundColor: stats ? scoreColor : 'action.disabledBackground',
              opacity: 0.72,
            },
          }}
        >
          <Box
            component="span"
            data-testid="chaos-score-content"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.3,
            }}
          >
            {isLoading
              ? <CircularProgress size={14} color="inherit" thickness={6} />
              : stats
                ? (
                  <>
                    <Box component="span" sx={{ fontSize: 7.5, fontWeight: 950, letterSpacing: 0.55, lineHeight: 1 }}>
                      CHAOS
                    </Box>
                    <Box component="span" sx={{ fontSize: score >= 100 ? 12 : 14, fontWeight: 950, lineHeight: 1 }}>
                      {score}
                    </Box>
                  </>
                )
                : <InsightsRounded sx={{ fontSize: 15 }} />}
          </Box>
        </IconButton>
      </span>
    </Tooltip>
  );
}
