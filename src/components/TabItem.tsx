import React from 'react';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Tab, TabVisualState, AvatarOverlay } from '../types/Tab';
import { getTabVisualState } from '../utils/tabVisualState';

interface TabItemProps {
  tab: Tab;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabHoverEnd: () => void;
  onTabClick: (tabId: number) => void;
  onShowPopover: (event: React.MouseEvent<HTMLElement>, message: string) => void;
}

export function TabItem({
  tab,
  previewTabId,
  originalTab,
  onTabHover,
  onTabHoverEnd,
  onTabClick,
  onShowPopover
}: TabItemProps) {
  const theme = useTheme();
  
  if (!tab.id) return null;
  
  const visualState = getTabVisualState(tab, previewTabId, originalTab, theme);
  
  // Render avatar overlay based on type and position
  const renderAvatarOverlay = (overlay: AvatarOverlay) => {
    const positionStyles = {
      'top-left': { top: -2, left: -2 },
      'top-right': { top: -2, right: -2 },
      'bottom-left': { bottom: -2, left: -2 },
      'bottom-right': { bottom: -2, right: -2 }
    };
    
    const size = overlay.type === 'checkmark' ? 12 : 8;
    
    switch (overlay.type) {
      case 'checkmark':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            ✓
          </div>
        );
        
      case 'loading':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            animation: 'pulse 1.5s infinite'
          }} />
        );
        
      case 'error':
      case 'stale':
      case 'preview':
        return (
          <div style={{
            position: 'absolute',
            ...positionStyles[overlay.position as keyof typeof positionStyles],
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: overlay.color,
            border: '1px solid white'
          }} />
        );
        
      default:
        return null;
    }
  };

  return (
    <ListItem
      onMouseEnter={() => onTabHover(tab.id!)}
      onMouseLeave={onTabHoverEnd}
      onClick={() => onTabClick(tab.id!)}
      sx={{
        borderLeft: `3px solid ${visualState.borderColor}`,
        backgroundColor: visualState.backgroundColor,
        paddingY: '3px',
        paddingLeft: '16px',
        paddingRight: '15px',
        opacity: visualState.opacity,
        transition: 'all 0.2s ease',
        position: 'relative',
        
        // Add subtle pattern overlay for stale tabs
        backgroundImage: visualState.opacity < 1 ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)' : 'none',
        
        '&:hover': {
          backgroundColor: visualState.backgroundColor === 'transparent' 
            ? theme.palette.action.hover
            : visualState.backgroundColor === theme.palette.secondary.main
            ? theme.palette.secondary.main
            : visualState.backgroundColor + '80'
        }
      }}
    >
      <ListItemAvatar sx={{
        minWidth: '32px',
        marginRight: '10px'
      }}>
        <Avatar
          alt={tab.title || 'Tab'}
          src={tab.favIconUrl || undefined}
          sx={{ 
            width: 25, 
            height: 25, 
            position: 'relative',
            border: originalTab?.id === tab.id ? `2px solid ${theme.palette.custom.original}` : 'none',
            filter: visualState.avatarFilter
          }}
        >
          {!tab.favIconUrl && 
           (tab.title ? tab.title.charAt(0).toUpperCase() : 'T')}
          
          {/* Render all avatar overlays */}
          {visualState.avatarOverlays.map((overlay, index) => (
            <React.Fragment key={`${overlay.type}-${index}`}>
              {renderAvatarOverlay(overlay)}
            </React.Fragment>
          ))}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText 
        primary={
          <span style={{
            fontWeight: 'normal',
            color: visualState.textColor,
            fontSize: '0.875rem'
          }}>
            {tab.title || 'Untitled Tab'}
          </span>
        }
        primaryTypographyProps={{
          noWrap: true,
          sx: { fontSize: '0.875rem' }
        }}
        sx={{
          color: visualState.textColor,
          paddingRight: 1,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      />
      
      <IconButton
        edge="end"
        onClick={(event) => onShowPopover(event, 'Tab Actions: Under construction...')}
        sx={{
          paddingY: 0,
          flexShrink: 0,
          minWidth: '32px',
          minHeight: '32px'
        }}
      >
        ⋮
      </IconButton>
    </ListItem>
  );
}
