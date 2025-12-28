import React from 'react';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import { Tab } from '../types/Tab';

interface HeaderProps {
  originalTab: Tab | null;
  onOpenSettings: () => void;
}

export function Header({ originalTab, onOpenSettings }: HeaderProps) {
  const theme = useTheme();
  
  if (!originalTab) return null;
  
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      backgroundColor: theme.palette.background.paper,
      borderBottom: `2px solid ${theme.palette.custom.original}`,
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar
          alt={originalTab.title || 'Original Tab'}
          src={originalTab.favIconUrl || undefined}
          sx={{ 
            width: 32, 
            height: 32,
            border: `2px solid ${theme.palette.custom.original}`
          }}
        >
          {!originalTab.favIconUrl && 
           (originalTab.title ? originalTab.title.charAt(0).toUpperCase() : 'T')}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '0.9rem',
            color: theme.palette.text.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {originalTab.title || 'Untitled Tab'}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: theme.palette.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {originalTab.url || 'No URL'}
          </div>
        </div>

        <Tooltip title="Open settings" placement="bottom" arrow>
          <IconButton
            aria-label="open settings"
            onClick={onOpenSettings}
            sx={{
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            size="small"
          >
            <SettingsIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
