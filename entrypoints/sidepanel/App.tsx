import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTabs } from '../../src/hooks/useTabs';
import { Header } from '../../src/components/Header';
import { TabList } from '../../src/components/TabList';
import { tabService } from '../../src/services/TabService';
import { clearVisualStateCache } from '../../src/utils/tabVisualState';
import { PerformanceMetrics } from '../../src/components/PerformanceMetrics';
import './App.css';

function App() {
  const theme = useTheme();
  
  // Use the custom hook for tab management
  const {
    allTabs,
    tabGroups,
    originalTab,
    previewTabId,
    handleTabHover,
    handleTabHoverEnd,
    handleTabClick
  } = useTabs();

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
    <div className="sidepanel">
      {/* Header with original tab information */}
      <Header originalTab={originalTab} />

      {/* Tab list */}
      <TabList
        allTabs={allTabs}
        tabGroups={tabGroups}
        previewTabId={previewTabId}
        originalTab={originalTab}
        onTabHover={handleTabHover}
        onTabHoverEnd={handleTabHoverEnd}
        onTabClick={handleTabClick}
        onCloseTab={handleCloseTab}
      />

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMetrics />
      )}
    </div>
  );
}

export default App;
