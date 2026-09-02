import React from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import LocalFireDepartmentRounded from '@mui/icons-material/LocalFireDepartmentRounded';
import TipsAndUpdatesRounded from '@mui/icons-material/TipsAndUpdatesRounded';
import { ChaosTrend } from '../services/TabChaosHistoryService';
import { getChaosScoreColor, TabChaosStats } from '../utils/tabChaos';

interface ChaosScoreOverlayProps {
  open: boolean;
  onClose: () => void;
  stats: TabChaosStats | null;
  trend: ChaosTrend | null;
}

function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ p: 1.15, border: 1, borderColor: 'divider', borderRadius: 1.75, backgroundColor: 'background.default' }}>
      <Typography sx={{ fontSize: 18, lineHeight: 1.1, fontWeight: 900, color: 'text.primary' }}>{value}</Typography>
      <Typography sx={{ mt: 0.35, fontSize: 10.25, color: 'text.secondary' }}>{label}</Typography>
    </Box>
  );
}

export function ChaosScoreOverlay({ open, onClose, stats, trend }: ChaosScoreOverlayProps) {
  if (!stats || !open) return null;
  const scoreColor = getChaosScoreColor(stats.score);
  const leastRecentLabel = stats.leastRecentTab
    ? stats.leastRecentTab.daysAgo === 0
      ? 'visited today'
      : `${stats.leastRecentTab.daysAgo} day${stats.leastRecentTab.daysAgo === 1 ? '' : 's'} ago`
    : 'not available';

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="chaos-score-title"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1250,
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      <Box
        aria-hidden="true"
        onClick={onClose}
        sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.28)', opacity: open ? 1 : 0, transition: 'opacity 180ms ease' }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 344,
          maxWidth: '92%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          borderLeft: 1,
          borderColor: 'divider',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        <Box sx={{ px: 2, py: 1.35, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ flex: 1 }}>
            <Typography id="chaos-score-title" sx={{ fontSize: 15, fontWeight: 900 }}>Tab Chaos Score</Typography>
            <Typography sx={{ fontSize: 10.25, color: 'text.secondary' }}>A useful signal, not a judgment.</Typography>
          </Box>
          <IconButton aria-label="Close Tab Chaos Score" onClick={onClose} size="small"><CloseRounded /></IconButton>
        </Box>

        <Box sx={{ p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 74, height: 74, display: 'grid', placeItems: 'center', borderRadius: '50%', color: 'common.white', backgroundColor: scoreColor, boxShadow: `0 8px 22px ${scoreColor}55` }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 27, lineHeight: 1, fontWeight: 950 }}>{stats.score}</Typography>
                <Typography sx={{ mt: 0.2, fontSize: 8.5, fontWeight: 800, opacity: 0.85 }}>/ 100</Typography>
              </Box>
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 900, color: scoreColor }}>{stats.level}</Typography>
              <Typography sx={{ mt: 0.2, fontSize: 11, lineHeight: 1.4, color: 'text.secondary' }}>{stats.levelDescription}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, backgroundColor: `${scoreColor}16`, border: `1px solid ${scoreColor}44` }}>
            <Typography sx={{ fontSize: 11.25, lineHeight: 1.45, fontWeight: 750 }}>{stats.summary}</Typography>
            <Typography sx={{ mt: 0.35, fontSize: 10.25, lineHeight: 1.4, color: 'text.secondary' }}>{trend?.message ?? 'Your trend starts with this check-in.'}</Typography>
          </Box>

          <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
            <StatTile label="open tabs" value={stats.totalTabs} />
            <StatTile label="Chrome windows" value={stats.windowsCount} />
            <StatTile label="duplicate copies" value={stats.duplicateTabs} />
            <StatTile label="tab groups" value={stats.groupCount} />
          </Box>

          {trend && (
            <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
              <Box sx={{ p: 1.1, display: 'flex', gap: 0.75, alignItems: 'center', borderRadius: 1.75, backgroundColor: 'action.hover' }}>
                <EmojiEventsRounded sx={{ fontSize: 19, color: 'secondary.main' }} />
                <Box><Typography sx={{ fontSize: 12.5, fontWeight: 900 }}>{trend.bestScore}</Typography><Typography sx={{ fontSize: 9.75, color: 'text.secondary' }}>personal best</Typography></Box>
              </Box>
              <Box sx={{ p: 1.1, display: 'flex', gap: 0.75, alignItems: 'center', borderRadius: 1.75, backgroundColor: 'action.hover' }}>
                <LocalFireDepartmentRounded sx={{ fontSize: 19, color: 'secondary.main' }} />
                <Box><Typography sx={{ fontSize: 12.5, fontWeight: 900 }}>{trend.checkInStreak} day{trend.checkInStreak === 1 ? '' : 's'}</Typography><Typography sx={{ fontSize: 9.75, color: 'text.secondary' }}>check-in streak</Typography></Box>
              </Box>
            </Box>
          )}

          <Typography sx={{ mt: 1.8, mb: 0.7, fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.7, color: 'text.secondary' }}>What shapes the score</Typography>
          <Box sx={{ display: 'grid', gap: 0.9 }}>
            {stats.factors.filter(factor => factor.points > 0).map(factor => (
              <Box key={factor.id}>
                <Box sx={{ mb: 0.35, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography sx={{ flex: 1, fontSize: 10.75, fontWeight: 750 }}>{factor.label}</Typography>
                  <Typography sx={{ fontSize: 9.75, color: 'text.secondary' }}>+{factor.points} · {factor.detail}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(factor.points / 42) * 100} sx={{ height: 4, borderRadius: 3, '& .MuiLinearProgress-bar': { backgroundColor: scoreColor } }} />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 1.8, p: 1.25, display: 'flex', gap: 1, borderRadius: 2, border: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
            <TipsAndUpdatesRounded sx={{ mt: 0.1, flexShrink: 0, fontSize: 20, color: 'secondary.main' }} />
            <Box>
              <Typography sx={{ fontSize: 11.25, fontWeight: 900 }}>{stats.quickWin.title}</Typography>
              <Typography sx={{ mt: 0.25, fontSize: 10.25, lineHeight: 1.4, color: 'text.secondary' }}>{stats.quickWin.detail}</Typography>
            </Box>
          </Box>

          <Typography sx={{ mt: 1.8, mb: 0.65, fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.7, color: 'text.secondary' }}>Your session</Typography>
          <Box sx={{ display: 'grid', gap: 0.65 }}>
            {stats.topDomains.length > 0 && <Typography sx={{ fontSize: 10.5, lineHeight: 1.4 }}><strong>Top domains:</strong> {stats.topDomains.map(item => `${item.domain} (${item.count})`).join(', ')}</Typography>}
            {stats.currentPosition && <Typography sx={{ fontSize: 10.5 }}><strong>Current tab:</strong> {stats.currentPosition.position} of {stats.currentPosition.total} in this window</Typography>}
            {stats.leastRecentTab && <Typography noWrap title={stats.leastRecentTab.title} sx={{ fontSize: 10.5 }}><strong>Longest untouched:</strong> {stats.leastRecentTab.domain} · {leastRecentLabel}</Typography>}
            {stats.sleepingTabs > 0 && <Typography sx={{ fontSize: 10.5 }}><strong>Sleeping:</strong> {stats.sleepingTabs} discarded tab{stats.sleepingTabs === 1 ? '' : 's'}</Typography>}
          </Box>

          <Typography sx={{ mt: 2, p: 1, borderRadius: 1.5, textAlign: 'center', fontSize: 9.75, lineHeight: 1.4, color: 'text.secondary', backgroundColor: 'action.hover' }}>
            Calculated and stored locally. TabShow does not send your tab data anywhere. Come back later to see how your session changed.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
