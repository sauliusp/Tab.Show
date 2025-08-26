import React from 'react';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { Tab, TabVisualState, AvatarOverlay } from '../types/Tab';
import { getTabVisualState } from '../utils/tabVisualState';
import { TabItemActionButton } from './TabItemActionButton';

interface TabItemProps {
  tab: Tab;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabHoverEnd: () => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  groupColor?: string; // Color of the tab group this tab belongs to
}

export function TabItem({
  tab,
  previewTabId,
  originalTab,
  onTabHover,
  onTabHoverEnd,
  onTabClick,
  onCloseTab,
  groupColor
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
        backgroundColor: visualState.backgroundColor !== 'transparent' ? visualState.backgroundColor : 
          (groupColor ? 
            (groupColor === 'grey' ? 'rgba(142, 142, 147, 0.1)' : 
             groupColor === 'blue' ? 'rgba(0, 122, 255, 0.1)' :
             groupColor === 'red' ? 'rgba(255, 59, 48, 0.1)' :
             groupColor === 'green' ? 'rgba(52, 199, 89, 0.1)' :
             groupColor === 'yellow' ? 'rgba(255, 204, 0, 0.1)' :
             groupColor === 'pink' ? 'rgba(255, 45, 146, 0.1)' :
             groupColor === 'purple' ? 'rgba(175, 82, 222, 0.1)' :
             groupColor === 'orange' ? 'rgba(255, 149, 0, 0.1)' : 'rgba(142, 142, 147, 0.1)')
            : 'transparent'),
        paddingY: '3px',
        paddingLeft: '15px',
        paddingRight: '20px',
        opacity: visualState.opacity,
        transition: 'all 0.2s ease',
        position: 'relative',
        
        // Use pseudo-elements for borders to avoid affecting layout
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          backgroundColor: visualState.borderColor,
          zIndex: 1
        },
        
        '&::after': groupColor ? {
          content: '""',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '6px',
          backgroundColor: groupColor === 'grey' ? '#8e8e93' : 
                         groupColor === 'blue' ? '#007aff' :
                         groupColor === 'red' ? '#ff3b30' :
                         groupColor === 'green' ? '#34c759' :
                         groupColor === 'yellow' ? '#ffcc00' :
                         groupColor === 'pink' ? '#ff2d92' :
                         groupColor === 'purple' ? '#af52de' :
                         groupColor === 'orange' ? '#ff9500' : '#8e8e93',
          zIndex: 1
        } : {},
        
        // Add subtle pattern overlay for stale tabs
        backgroundImage: visualState.opacity < 1 ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)' : 'none',
        
        '&:hover': {
          backgroundColor: visualState.backgroundColor !== 'transparent' ? 
            (visualState.backgroundColor === theme.palette.secondary.main
              ? theme.palette.secondary.main
              : visualState.backgroundColor + '80')
            : (groupColor ? 
                (groupColor === 'grey' ? 'rgba(142, 142, 147, 0.15)' : 
                 groupColor === 'blue' ? 'rgba(0, 122, 255, 0.15)' :
                 groupColor === 'red' ? 'rgba(255, 59, 48, 0.15)' :
                 groupColor === 'green' ? 'rgba(52, 199, 89, 0.15)' :
                 groupColor === 'yellow' ? 'rgba(255, 204, 0, 0.15)' :
                 groupColor === 'pink' ? 'rgba(255, 45, 146, 0.15)' :
                 groupColor === 'purple' ? 'rgba(175, 82, 222, 0.15)' :
                 groupColor === 'orange' ? 'rgba(255, 149, 0, 0.15)' : 'rgba(142, 142, 147, 0.15)')
                : theme.palette.action.hover)
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
      
      <TabItemActionButton 
        tabId={tab.id} 
        onCloseTab={onCloseTab}
      />
    </ListItem>
  );
}
