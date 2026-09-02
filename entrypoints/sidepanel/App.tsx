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
import { ChaosScoreButton } from '../../src/components/ChaosScoreButton';
import { ChaosScoreOverlay } from '../../src/components/ChaosScoreOverlay';
import { PanelEngagementBar } from '../../src/components/PanelEngagementBar';
import { useUserSettings } from '../../src/contexts/UserSettingsContext';
import { useTabChaos } from '../../src/hooks/useTabChaos';
import './App.css';
import { Tab, TabSortMode } from '../../src/types/Tab';
import { selectTabs } from '../../src/utils/tabSelectors';

function App() {
  const theme = useTheme();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isChaosOpen, setIsChaosOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [sortMode, setSortMode] = React.useState<TabSortMode>('current');
  const [highlightedTabId, setHighlightedTabId] = React.useState<number | null>(null);
  const [inputModality, setInputModality] = React.useState<'pointer' | 'keyboard'>('pointer');
  const [currentWindowId, setCurrentWindowId] = React.useState<number | null>(null);
  const { hoverPreviewDelayMs, allWindows, setAllWindows } = useUserSettings();
  const chaos = useTabChaos();
  
  // Use the custom hook for tab management
  const {
    isLoading,
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

  React.useEffect(() => {
    const focusSearch = () => {
      if (process.env.NODE_ENV !== 'test') window.focus();
      searchInputRef.current?.focus({ preventScroll: true });
    };
    focusSearch();
    const animationFrame = requestAnimationFrame(focusSearch);
    const finalRetry = window.setTimeout(focusSearch, 50);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(finalRetry);
    };
  }, []);

  React.useEffect(() => { void tabService.getCurrentWindowId().then(setCurrentWindowId); }, []);

  const openTabs = React.useMemo(() => (
    Object.values(tabListState.items)
      .filter(item => item.type === 'tab')
      .map(item => item.data as Tab)
  ), [tabListState.items]);

  const matchingTabs = React.useMemo(() => {
    const tabs = openTabs
      .filter(tab => {
        if (query.trim() || (sortMode !== 'current' && sortMode !== 'group')) return true;
        return tab.groupId === undefined || tab.groupId < 0 || tabListState.groupExpansionState[tab.groupId] !== false;
      });
    return selectTabs(tabs, { query, sortMode, currentWindowId });
  }, [openTabs, tabListState.groupExpansionState, query, sortMode, currentWindowId]);

  const openWindowCount = React.useMemo(
    () => new Set(openTabs.map(tab => tab.windowId)).size,
    [openTabs]
  );

  React.useEffect(() => {
    if (!matchingTabs.some(tab => tab.id === highlightedTabId)) {
      setHighlightedTabId(matchingTabs[0]?.id ?? null);
    }
  }, [matchingTabs, highlightedTabId]);

  const activeHighlightedTabId = React.useMemo(() => (
    matchingTabs.some(tab => tab.id === highlightedTabId)
      ? highlightedTabId
      : matchingTabs[0]?.id ?? null
  ), [matchingTabs, highlightedTabId]);

  const handlePointerIntent = React.useCallback((tabId: number) => {
    setInputModality('pointer');
    setHighlightedTabId(tabId);
    handleTabHover(tabId);
  }, [handleTabHover]);

  const handleKeyboard = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button,[role="button"],[role="combobox"],[role="menu"],[role="menuitem"],input[type="checkbox"]')) return;
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'Escape') { event.preventDefault(); void handleCancel(); return; }
    if (event.key === 'Enter') {
      const selectedTab = matchingTabs.find(tab => tab.id === activeHighlightedTabId) ?? matchingTabs[0];
      if (selectedTab?.id !== undefined) {
        event.preventDefault();
        void handleTabClick(selectedTab.id);
      }
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!matchingTabs.length) return;
    setInputModality('keyboard');
    const currentIndex = matchingTabs.findIndex(tab => tab.id === activeHighlightedTabId);
    const nextIndex = currentIndex < 0
      ? (event.key === 'ArrowDown' ? 0 : matchingTabs.length - 1)
      : Math.max(0, Math.min(matchingTabs.length - 1, currentIndex + (event.key === 'ArrowDown' ? 1 : -1)));
    const next = matchingTabs[nextIndex];
    if (next?.id !== undefined) {
      setHighlightedTabId(next.id);
    }
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
      <ChaosScoreOverlay
        open={isChaosOpen}
        onClose={() => setIsChaosOpen(false)}
        stats={chaos.stats}
        trend={chaos.trend}
      />

      <Box sx={{ px: 1.5, pt: 1.25, pb: 1.25, borderBottom: 1, borderColor: 'divider', display: 'grid', gap: 1 }}>
        <Box
          data-testid="top-control-grid"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 40px',
            columnGap: 0.75,
            rowGap: 1,
            alignItems: 'stretch',
          }}
        >
          <Box
            role="group"
            aria-label="Tab scope"
            data-testid="tab-scope-control"
            sx={{
              p: 0.35,
              minWidth: 0,
              minHeight: 40,
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
                    color: selected ? 'primary.contrastText' : 'text.secondary',
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
              sx={{ width: 40, height: 40, border: 1, borderColor: 'divider', borderRadius: 1.5 }}
            >
              <SettingsRounded sx={{ fontSize: 19 }} />
            </IconButton>
          </Tooltip>
          <TextField
            autoFocus
            inputRef={searchInputRef}
            fullWidth
            size="small"
            value={query}
            onChange={(event) => { setInputModality('keyboard'); cancelPendingPreview(); setQuery(event.target.value); }}
            placeholder="Search tabs, no mouse needed"
            inputProps={{
              'aria-label': 'Search tabs',
              'aria-controls': 'tab-results',
              'aria-describedby': 'keyboard-search-hint',
              'aria-activedescendant': activeHighlightedTabId === null ? undefined : `tab-option-${activeHighlightedTabId}`
            }}
            InputProps={{ startAdornment: <SearchRounded sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}
          />
          <ChaosScoreButton
            stats={chaos.stats}
            trend={chaos.trend}
            isLoading={chaos.isLoading}
            onOpen={() => { setIsSettingsOpen(false); setIsChaosOpen(true); }}
          />
        </Box>
        <Typography id="keyboard-search-hint" sx={{ mt: -0.35, fontSize: 10.5, color: 'text.secondary' }}>
          ↑↓ select · Enter open · Esc return
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, '@media (max-width: 380px)': { gap: 0.5 } }}>
          <Select size="small" value={sortMode} onChange={(event) => setSortMode(event.target.value as TabSortMode)} sx={{ width: 128, minWidth: 100, flexShrink: 1, fontSize: 11.5, '& .MuiSelect-select': { py: 0.65 } }} aria-label="Sort tabs">
            <MenuItem value="current">Current order</MenuItem>
            <MenuItem value="recently-used">Recently used</MenuItem>
            <MenuItem value="recently-opened">Recently added (approx.)</MenuItem>
            <MenuItem value="domain">By domain</MenuItem>
            <MenuItem value="group">By tab group</MenuItem>
          </Select>
          {isLoading ? (
            <Typography sx={{ ml: 'auto', fontSize: 10.5, color: 'text.secondary' }}>Loading…</Typography>
          ) : (
            <Box
              role="status"
              aria-live="polite"
              aria-label={`Open tabs: ${openTabs.length}${allWindows ? `; Chrome windows: ${openWindowCount}` : ''}`}
              data-testid="tab-count-summary"
              sx={{
                ml: 'auto',
                minHeight: 32,
                px: 0.85,
                display: 'flex',
                alignItems: 'center',
                gap: 0.55,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.5,
                backgroundColor: 'background.paper',
                whiteSpace: 'nowrap',
                minWidth: 0,
                overflow: 'hidden',
                '@media (max-width: 380px)': { px: 0.6, gap: 0.4 },
              }}
            >
              <TabRounded sx={{ flexShrink: 0, fontSize: 14, color: 'text.secondary' }} />
              <Typography component="span" sx={{ fontSize: 8, lineHeight: 1, fontWeight: 900, letterSpacing: 0.45, color: 'text.secondary', '@media (max-width: 380px)': { display: 'none' } }}>
                OPEN TABS
              </Typography>
              <Typography component="strong" sx={{ fontSize: 13, lineHeight: 1, fontWeight: 950, color: 'text.primary' }}>
                {openTabs.length}
              </Typography>
              {allWindows && (
                <>
                  <Box aria-hidden="true" sx={{ height: 16, mx: 0.15, borderLeft: 1, borderColor: 'divider' }} />
                  <WindowRounded sx={{ flexShrink: 0, fontSize: 13, color: 'text.secondary' }} />
                  <Typography component="span" sx={{ fontSize: 8, lineHeight: 1, fontWeight: 900, letterSpacing: 0.4, color: 'text.secondary', '@media (max-width: 380px)': { display: 'none' } }}>
                    WINDOWS
                  </Typography>
                  <Typography component="strong" sx={{ fontSize: 12, lineHeight: 1, fontWeight: 900, color: 'text.primary' }}>
                    {openWindowCount}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Tab list */}
      <TabList
        isLoading={isLoading}
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
        highlightedTabId={activeHighlightedTabId}
        pointerPreviewEnabled={inputModality === 'pointer'}
        onPointerIntent={handlePointerIntent}
      />

      <PanelEngagementBar />

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMetrics />
      )}

    </div>
  );
}

export default App;
