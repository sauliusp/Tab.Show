import React from 'react';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import PushPinRounded from '@mui/icons-material/PushPinRounded';
import BedtimeRounded from '@mui/icons-material/BedtimeRounded';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { Tab, TabVisualState, AvatarOverlay } from '../types/Tab';
import { getTabVisualState } from '../utils/tabVisualState';
import { TabItemActionButton } from './TabItemActionButton';
import { TabFavicon } from './TabFavicon';

interface TabItemProps {
  tab: Tab;
  previewTabId: number | null;
  originalTab: Tab | null;
  onTabHover: (tabId: number) => void;
  onTabHoverEnd?: (tabId: number) => void;
  onTabClick: (tabId: number) => void;
  onCloseTab: (tabId: number) => void;
  groupColor?: string; // Color of the tab group this tab belongs to
  highlighted?: boolean;
  duplicateCount?: number;
  isOtherWindow?: boolean;
  pointerPreviewEnabled?: boolean;
  onPointerIntent?: (tabId: number) => void;
}

// Custom comparison function for React.memo
function arePropsEqual(prevProps: TabItemProps, nextProps: TabItemProps): boolean {
  return (
    prevProps.tab.id === nextProps.tab.id &&
    prevProps.tab.title === nextProps.tab.title &&
    prevProps.tab.status === nextProps.tab.status &&
    prevProps.tab.favIconUrl === nextProps.tab.favIconUrl &&
    prevProps.tab.groupId === nextProps.tab.groupId &&
    prevProps.tab.url === nextProps.tab.url &&
    prevProps.tab.pinned === nextProps.tab.pinned &&
    prevProps.tab.audible === nextProps.tab.audible &&
    prevProps.tab.mutedInfo?.muted === nextProps.tab.mutedInfo?.muted &&
    prevProps.tab.discarded === nextProps.tab.discarded &&
    prevProps.tab.lastAccessed === nextProps.tab.lastAccessed &&
    prevProps.previewTabId === nextProps.previewTabId &&
    prevProps.originalTab?.id === nextProps.originalTab?.id &&
    prevProps.groupColor === nextProps.groupColor &&
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.duplicateCount === nextProps.duplicateCount &&
    prevProps.isOtherWindow === nextProps.isOtherWindow
    && prevProps.pointerPreviewEnabled === nextProps.pointerPreviewEnabled
  );
}

export const TabItem = React.memo(({
  tab,
  previewTabId,
  originalTab,
  onTabHover,
  onTabHoverEnd,
  onTabClick,
  onCloseTab,
  groupColor,
  highlighted,
  duplicateCount = 1,
  isOtherWindow = false,
  pointerPreviewEnabled = true,
  onPointerIntent
}: TabItemProps) => {
  const theme = useTheme();
  
  // Performance monitoring
  //usePerformanceMonitor('TabItem');
  
  if (!tab.id) return null;
  
  const visualState = getTabVisualState(tab, previewTabId, originalTab, theme);
  const isOriginalTab = originalTab?.id === tab.id;
  const [isHovered, setIsHovered] = React.useState(false);
  const isPreviewTab = previewTabId === tab.id;
  const stateForeground = isOriginalTab
    ? theme.palette.primary.contrastText
    : isPreviewTab
      ? theme.palette.secondary.contrastText
      : theme.palette.text.secondary;
  const showHoverSpinner = isHovered && !isPreviewTab && !isOriginalTab && !isOtherWindow;
  const avatarBorder = isOriginalTab
    ? `3px solid ${theme.palette.custom.original}`
    : showHoverSpinner
      ? 'none'
      : groupColor
        ? `3px solid ${groupColor}`
        : 'none';

  const secondaryLabel = React.useMemo(() => {
    if (!tab.url) return 'No address';
    try {
      const parsed = new URL(tab.url);
      return parsed.hostname || `${parsed.protocol}//${parsed.pathname.split('/')[0]}`;
    } catch {
      return tab.url;
    }
  }, [tab.url]);
  
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
      id={`tab-option-${tab.id}`}
      aria-current={highlighted ? 'true' : undefined}
      title={isOtherWindow
        ? 'Another Chrome window. Click to switch. Hover preview is unavailable.'
        : tab.url || tab.title || 'Untitled Tab'}
      onMouseEnter={() => {
        setIsHovered(true);
        if (pointerPreviewEnabled) {
          onPointerIntent?.(tab.id!);
          if (!onPointerIntent) onTabHover(tab.id!);
        }
      }}
      onMouseMove={() => {
        if (!pointerPreviewEnabled) {
          onPointerIntent?.(tab.id!);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onTabHoverEnd?.(tab.id!);
      }}
      onClick={() => onTabClick(tab.id!)}
      sx={{
        ...visualState.listItemStyles,
        cursor: 'pointer',
        mx: 0.75,
        width: 'calc(100% - 12px)',
        borderRadius: 1.75,
        border: 1,
        borderColor: isPreviewTab ? 'secondary.main' : isOriginalTab ? 'primary.main' : 'divider',
        overflow: 'hidden',
        backgroundColor: highlighted && !isOriginalTab && !isPreviewTab
          ? theme.palette.action.selected
          : visualState.listItemStyles.backgroundColor,
        
        // Use pseudo-elements for borders to avoid affecting layout
        '&::before': visualState.pseudoElementStyles.before,
        ...(visualState.pseudoElementStyles.after && {
          '&::after': visualState.pseudoElementStyles.after
        }),
        
        '&:hover': visualState.hoverStyles
      }}
    >
      <ListItemAvatar sx={{
        minWidth: '34px',
        marginRight: '9px'
      }}>
        <TabFavicon
          tab={tab}
          alt={tab.title || 'Tab'}
          showImage={!showHoverSpinner}
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
            tab.title ? tab.title.charAt(0).toUpperCase() : 'T'
          )}
          
          {!showHoverSpinner && (
            visualState.avatarOverlays.map((overlay, index) => (
              <React.Fragment key={`${overlay.type}-${index}`}>
                {renderAvatarOverlay(overlay)}
              </React.Fragment>
            ))
          )}
        </TabFavicon>
      </ListItemAvatar>
      
      <ListItemText 
        primary={
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            <Box component="span" sx={{ ...visualState.textStyles, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tab.title || 'Untitled Tab'}
            </Box>
            {duplicateCount > 1 && (
              <Box component="span" title={`${duplicateCount} tabs share this URL`} sx={{ flexShrink: 0, fontSize: 10, fontWeight: 800, color: 'inherit', opacity: 0.78 }}>
                {duplicateCount} duplicates
              </Box>
            )}
          </Box>
        }
        primaryTypographyProps={{
          noWrap: true,
          sx: { fontSize: '0.82rem', lineHeight: 1.25 }
        }}
        secondary={secondaryLabel}
        secondaryTypographyProps={{
          noWrap: true,
          sx: { mt: 0.2, fontSize: 10.5, lineHeight: 1.2, color: isOriginalTab || isPreviewTab ? 'inherit' : 'text.secondary', opacity: isOriginalTab || isPreviewTab ? 0.78 : 1 }
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: stateForeground }}>
        {isOtherWindow && (
          <Box
            component="span"
            aria-label="Another window; click to switch"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.25,
              px: 0.75,
              py: 0.35,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              fontSize: 10.5,
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            Switch
            <LaunchRounded sx={{ fontSize: 12 }} />
          </Box>
        )}
        {tab.pinned && <PushPinRounded sx={{ fontSize: 15 }} titleAccess="Pinned" />}
        {tab.mutedInfo?.muted
          ? <VolumeOffRounded sx={{ fontSize: 16 }} titleAccess="Muted" />
          : tab.audible && <VolumeUpRounded sx={{ fontSize: 16 }} titleAccess="Playing audio" />}
        {tab.discarded && <BedtimeRounded sx={{ fontSize: 15 }} titleAccess="Sleeping" />}
      </Box>
      
      {!isOtherWindow && (
        <TabItemActionButton
          tabId={tab.id}
          onCloseTab={onCloseTab}
          iconColor={isOriginalTab || isPreviewTab ? stateForeground : undefined}
        />
      )}
    </ListItem>
  );
}, arePropsEqual);
