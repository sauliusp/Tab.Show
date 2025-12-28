import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ActionLinkButton } from '../../src/components/ActionLinkButton';
import { useTabs } from '../../src/hooks/useTabs';
import { Header } from '../../src/components/Header';
import { TabList } from '../../src/components/TabList';
import { tabService } from '../../src/services/TabService';
import { clearVisualStateCache } from '../../src/utils/tabVisualState';
import { PerformanceMetrics } from '../../src/components/PerformanceMetrics';
import { EXTENSION_URLS } from '../../src/parameters';
import { SettingsOverlay } from '../../src/components/SettingsOverlay';
import { useUserSettings } from '../../src/contexts/UserSettingsContext';
import './App.css';

function App() {
  const theme = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { hoverPreviewDelayMs } = useUserSettings();
  
  // Use the custom hook for tab management
  const {
    tabListState,
    originalTab,
    previewTabId,
    handleTabHover,
    handleSidePanelHoverEnd,
    handleTabClick,
    handleGroupToggle
  } = useTabs({ hoverPreviewDelayMs });

  // Clear visual state cache when theme changes to prevent stale cached values
  React.useEffect(() => {
    clearVisualStateCache();
  }, [theme]);

  const handleSettingsToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsSettingsOpen((prev) => !prev);
  };

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
    <div className="sidepanel" onMouseLeave={handleSidePanelHoverEnd}>
      {/* Header with original tab information */}
      <Header 
        originalTab={originalTab} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />

      <SettingsOverlay 
        open={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Tab list */}
      <TabList
        tabListState={tabListState}
        previewTabId={previewTabId}
        originalTab={originalTab}
        onTabHover={handleTabHover}
        onTabClick={handleTabClick}
        onCloseTab={handleCloseTab}
        onGroupToggle={handleGroupToggle}
      />

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMetrics />
      )}

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 12,
          right: 12,
          zIndex: 1000,
          display: 'flex',
          gap: 1,
          flexDirection: 'row',
        }}
       >
        
        <ActionLinkButton
          href="#"
          label="Try Settings"
          title="Open settings"
          enterDelay={500}
          placement="top"
          onClick={handleSettingsToggle}
          onMouseEnter={handleSidePanelHoverEnd}
        />

        <ActionLinkButton
          href={EXTENSION_URLS.CHROME_WEB_STORE_REVIEW}
          target="_blank"
          rel="noopener noreferrer"
          label="Rate TabShow"
          title="Leave a review on the Chrome Web Store"
          enterDelay={500}
          placement="top"
          onMouseEnter={handleSidePanelHoverEnd}
        />

        <ActionLinkButton
          href={EXTENSION_URLS.FEATURE_REQUEST}
          target="_blank"
          rel="noopener noreferrer"
          label="Suggest Feature"
          title="Tell me how I could make the product more useful to you"
          enterDelay={500}
          placement="top"
          onMouseEnter={handleSidePanelHoverEnd}
        />
      </Box>
    </div>
  );
}

export default App;
