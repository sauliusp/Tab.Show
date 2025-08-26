import React from 'react';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { Tab } from '../types/Tab';

interface HeaderProps {
  originalTab: Tab | null;
}

export function Header({ originalTab }: HeaderProps) {
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
        <div style={{
          fontSize: '0.7rem',
          backgroundColor: theme.palette.custom.original,
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap'
        }}>
          Original
        </div>
      </div>
    </div>
  );
}
