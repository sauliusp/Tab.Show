import React from 'react';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { Tab, TabVisualState, AvatarOverlay } from '../types/Tab';
import { getTabVisualState } from '../utils/tabVisualState';
import { TabItemActionButton } from './TabItemActionButton';

interface TabItemProps {
  tab: Tab;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  groupColor?: string; // Color of the tab group this tab belongs to
}

// Custom comparison function for React.memo
function arePropsEqual(prevProps: TabItemProps, nextProps: TabItemProps): boolean {
  return (
    prevProps.tab.id === nextProps.tab.id &&
    prevProps.tab.title === nextProps.tab.title &&
    prevProps.tab.status === nextProps.tab.status &&
    prevProps.tab.favIconUrl === nextProps.tab.favIconUrl &&
    prevProps.tab.groupId === nextProps.tab.groupId &&
    prevProps.tab.lastAccessed === nextProps.tab.lastAccessed &&
    prevProps.previewTabId === nextProps.previewTabId &&
    prevProps.originalTab?.id === nextProps.originalTab?.id &&
    prevProps.groupColor === nextProps.groupColor
  );
}

export const TabItem = React.memo(({
  tab,
  previewTabId,
  originalTab,
  onTabHover,
  onTabClick,
  onCloseTab,
  groupColor
}: TabItemProps) => {
  const theme = useTheme();
  
  // Performance monitoring
  //usePerformanceMonitor('TabItem');
  
  if (!tab.id) return null;
  
  const visualState = getTabVisualState(tab, previewTabId, originalTab, theme);
  const isOriginalTab = originalTab?.id === tab.id;
  const [isHovered, setIsHovered] = React.useState(false);
  const isPreviewTab = previewTabId === tab.id;
  const showHoverSpinner = isHovered && !isPreviewTab && !isOriginalTab;
  const avatarBorder = isOriginalTab
    ? `3px solid ${theme.palette.custom.original}`
    : showHoverSpinner
      ? 'none'
      : groupColor
        ? `3px solid ${groupColor}`
        : 'none';
  
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
      title={tab.url || tab.title || 'Untitled Tab'}
      onMouseEnter={() => {
        setIsHovered(true);
        onTabHover(tab.id!);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onTabClick(tab.id!)}
      sx={{
        ...visualState.listItemStyles,
        cursor: 'pointer',
        
        // Use pseudo-elements for borders to avoid affecting layout
        '&::before': visualState.pseudoElementStyles.before,
        ...(visualState.pseudoElementStyles.after && {
          '&::after': visualState.pseudoElementStyles.after
        }),
        
        '&:hover': visualState.hoverStyles
      }}
    >
      <ListItemAvatar sx={{
        minWidth: '32px',
        marginRight: '10px'
      }}>
        <Avatar
          alt={tab.title || 'Tab'}
          src={!showHoverSpinner ? tab.favIconUrl || undefined : undefined}
          sx={{
            ...visualState.avatarStyles,
            border: avatarBorder
          }}
        >
          {showHoverSpinner ? (
            <CircularProgress
              enableTrackSlot
              variant="indeterminate"
              color="primary"
              size={24}
              thickness={6}
            />
          ) : (
            !tab.favIconUrl && (tab.title ? tab.title.charAt(0).toUpperCase() : 'T')
          )}
          
          {!showHoverSpinner && (
            visualState.avatarOverlays.map((overlay, index) => (
              <React.Fragment key={`${overlay.type}-${index}`}>
                {renderAvatarOverlay(overlay)}
              </React.Fragment>
            ))
          )}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText 
        primary={
          <span style={visualState.textStyles}>
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
        iconColor={isOriginalTab ? theme.palette.common.white : undefined}
      />
    </ListItem>
  );
}, arePropsEqual);
