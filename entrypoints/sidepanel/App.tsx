import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, IconButton, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import TabRounded from '@mui/icons-material/TabRounded';
import WindowRounded from '@mui/icons-material/WindowRounded';
import { useTabs } from '../../src/hooks/useTabs';
import { TabList } from '../../src/components/TabList';
import { tabService } from '../../src/services/TabService';
import { clearVisualStateCache } from '../../src/utils/tabVisualState';
import { PerformanceMetrics } from '../../src/components/PerformanceMetrics';
import { SettingsOverlay } from '../../src/components/SettingsOverlay';
import { useUserSettings } from '../../src/contexts/UserSettingsContext';
import './App.css';
import { Tab, TabSortMode } from '../../src/types/Tab';
import { selectTabs } from '../../src/utils/tabSelectors';

function App() {
  const theme = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [sortMode, setSortMode] = React.useState<TabSortMode>('current');
  const [highlightedTabId, setHighlightedTabId] = React.useState<number | null>(null);
  const [currentWindowId, setCurrentWindowId] = React.useState<number | null>(null);
  const { hoverPreviewDelayMs, allWindows, setAllWindows } = useUserSettings();
  
  // Use the custom hook for tab management
  const {
    tabListState,
    originalTab,
    previewTabId,
    handleTabHover,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleGroupToggle,
    handleTabHoverEnd,
    cancelPendingPreview,
    handleCancel
  } = useTabs({ hoverPreviewDelayMs, allWindows });

  React.useEffect(() => { void tabService.getCurrentWindowId().then(setCurrentWindowId); }, []);

  const matchingTabs = React.useMemo(() => {
    const tabs = Object.values(tabListState.items)
      .filter(item => item.type === 'tab')
      .map(item => item.data as Tab)
      .filter(tab => {
        if (query.trim() || (sortMode !== 'current' && sortMode !== 'group')) return true;
        return tab.groupId === undefined || tab.groupId < 0 || tabListState.groupExpansionState[tab.groupId] !== false;
      });
    return selectTabs(tabs, { query, sortMode, currentWindowId });
  }, [tabListState.items, tabListState.groupExpansionState, query, sortMode, currentWindowId]);

  const matchingWindowCount = React.useMemo(
    () => new Set(matchingTabs.map(tab => tab.windowId)).size,
    [matchingTabs]
  );

  React.useEffect(() => {
    if (!matchingTabs.some(tab => tab.id === highlightedTabId)) {
      setHighlightedTabId(matchingTabs[0]?.id ?? null);
    }
  }, [matchingTabs, highlightedTabId]);

  const handleKeyboard = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button,[role="button"],[role="combobox"],[role="menu"],[role="menuitem"],input[type="checkbox"]')) return;
    if (event.key === 'Escape') { event.preventDefault(); void handleCancel(); return; }
    if (event.key === 'Enter' && highlightedTabId !== null) { event.preventDefault(); void handleTabClick(highlightedTabId); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const currentIndex = matchingTabs.findIndex(tab => tab.id === highlightedTabId);
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    if (!matchingTabs.length) return;
    const next = matchingTabs[(currentIndex + delta + matchingTabs.length) % matchingTabs.length];
    if (next?.id !== undefined) { setHighlightedTabId(next.id); handleTabHover(next.id); }
  };

  // Clear visual state cache when theme changes to prevent stale cached values
  React.useEffect(() => {
    clearVisualStateCache();
  }, [theme]);

  const handleCloseTab = async (tabId: number) => {
    try {
      const success = await tabService.closeTab(tabId);
      if (success) {
        console.log(`Successfully closed tab ${tabId}`);
        // The tab list will automatically update through the useTabs hook
        // since it's listening to browser tab events
      } else {
        console.error(`Failed to close tab ${tabId}`);
      }
    } catch (error) {
      console.error(`Error closing tab ${tabId}:`, error);
    }
  };


  return (
    <div className="sidepanel" onMouseLeave={handleSidePanelHoverEnd} onKeyDown={handleKeyboard}>
      <SettingsOverlay 
        open={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <Box sx={{ px: 1.5, pt: 1.25, pb: 1.25, borderBottom: 1, borderColor: 'divider', display: 'grid', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0.75 }}>
          <Box
            role="group"
            aria-label="Tab scope"
            sx={{
              p: 0.35,
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0.35,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              backgroundColor: 'action.hover'
            }}
          >
            {[
              { value: false, label: 'Current window', icon: <TabRounded sx={{ fontSize: 16 }} /> },
              { value: true, label: 'All windows', icon: <WindowRounded sx={{ fontSize: 16 }} /> }
            ].map(option => {
              const selected = allWindows === option.value;
              return (
                <ButtonBase
                  key={option.label}
                  aria-label={option.label}
                  aria-pressed={selected}
                  onClick={() => setAllWindows(option.value)}
                  sx={{
                    py: 0.7,
                    gap: 0.75,
                    borderRadius: 1,
                    fontSize: 11.5,
                    fontWeight: 750,
                    color: selected ? 'common.white' : 'text.secondary',
                    backgroundColor: selected ? 'primary.main' : 'transparent',
                    boxShadow: selected ? '0 2px 8px rgba(44, 42, 74, 0.18)' : 'none',
                    '&:hover': { backgroundColor: selected ? 'primary.dark' : 'background.paper' }
                  }}
                >
                  {option.icon}{option.label}
                </ButtonBase>
              );
            })}
          </Box>
          <Tooltip title="Settings">
            <IconButton
              aria-label="open settings"
              onClick={() => setIsSettingsOpen(true)}
              sx={{ width: 38, border: 1, borderColor: 'divider', borderRadius: 1.5 }}
            >
              <SettingsRounded sx={{ fontSize: 19 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={query}
          onChange={(event) => { cancelPendingPreview(); setQuery(event.target.value); }}
          placeholder="Search tabs"
          inputProps={{ 'aria-label': 'Search tabs' }}
          InputProps={{ startAdornment: <SearchRounded sx={{ mr: 1, color: 'text.secondary' }} /> }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Select size="small" value={sortMode} onChange={(event) => setSortMode(event.target.value as TabSortMode)} sx={{ minWidth: 128, fontSize: 11.5, '& .MuiSelect-select': { py: 0.65 } }} aria-label="Sort tabs">
            <MenuItem value="current">Current order</MenuItem>
            <MenuItem value="recently-used">Recently used</MenuItem>
            <MenuItem value="recently-opened">Recently added (approx.)</MenuItem>
            <MenuItem value="domain">By domain</MenuItem>
            <MenuItem value="group">By tab group</MenuItem>
          </Select>
          <Typography sx={{ ml: 'auto', fontSize: 10.5, color: 'text.secondary', textAlign: 'right' }}>
            {matchingTabs.length} {matchingTabs.length === 1 ? 'tab' : 'tabs'}{allWindows ? ` · ${matchingWindowCount} windows` : ''}
          </Typography>
        </Box>
      </Box>

      {/* Tab list */}
      <TabList
        tabListState={tabListState}
        previewTabId={previewTabId}
        originalTab={originalTab}
        onTabHover={handleTabHover}
        onTabHoverEnd={handleTabHoverEnd}
        onTabClick={handleTabClick}
        onCloseTab={handleCloseTab}
        onGroupToggle={handleGroupToggle}
        query={query}
        sortMode={sortMode}
        allWindows={allWindows}
        currentWindowId={currentWindowId}
        highlightedTabId={highlightedTabId}
        onHighlight={setHighlightedTabId}
      />

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMetrics />
      )}

    </div>
  );
}

export default App;
