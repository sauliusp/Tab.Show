import React from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface TabItemActionButtonProps {
  tabId: number;
  onCloseTab: (tabId: number) => void;
  iconColor?: string;
}

export const TabItemActionButton = React.memo(({ tabId, onCloseTab, iconColor }: TabItemActionButtonProps) => (
  <Tooltip title="Close tab" placement="left">
    <IconButton
      aria-label="Close tab"
      size="small"
      onClick={(event) => {
        event.stopPropagation();
        onCloseTab(tabId);
      }}
      sx={{
        ml: 0.25,
        p: 0.5,
        flexShrink: 0,
        color: iconColor ?? 'text.secondary',
        '&:hover': { backgroundColor: 'action.hover' }
      }}
    >
      <CloseRounded sx={{ fontSize: 17 }} />
    </IconButton>
  </Tooltip>
));
