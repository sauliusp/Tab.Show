import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import TabRounded from '@mui/icons-material/TabRounded';
import { Tab } from '../types/Tab';

interface HeaderProps {
  originalTab: Tab | null;
  onOpenSettings: () => void;
}

export function Header({ originalTab, onOpenSettings }: HeaderProps) {
  return (
    <Box sx={{ px: 1.5, pt: 1.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box sx={{
        width: 34,
        height: 34,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        color: 'common.white',
        background: theme => `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        boxShadow: '0 6px 18px rgba(44, 42, 74, 0.22)'
      }}>
        <TabRounded sx={{ fontSize: 21 }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: 18, lineHeight: 1.1, fontWeight: 850, letterSpacing: -0.35 }}>
          TabShow
        </Typography>
        <Typography noWrap sx={{ mt: 0.2, fontSize: 10.5, color: 'text.secondary' }}>
          {originalTab ? `Previewing from ${originalTab.title || 'current tab'}` : 'Instant tab preview'}
        </Typography>
      </Box>
      <Tooltip title="Settings">
        <IconButton aria-label="open settings" onClick={onOpenSettings} size="small" sx={{ border: 1, borderColor: 'divider' }}>
          <SettingsRounded fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
