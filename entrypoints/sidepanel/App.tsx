import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTabs } from '../../src/hooks/useTabs';
import { Header } from '../../src/components/Header';
import { TabList } from '../../src/components/TabList';
import './App.css';

function App() {
  const theme = useTheme();
  
  // Use the custom hook for tab management
  const {
    allTabs,
    originalTab,
    previewTabId,
    handleTabHover,
    handleTabHoverEnd,
    handleTabClick
  } = useTabs();

  const handleCloseTab = (tabId: number) => {
    // TODO: Implement tab closing functionality
    console.log(`Closing tab ${tabId}`);
  };

  return (
    <div className="sidepanel">
      {/* Header with original tab information */}
      <Header originalTab={originalTab} />

      {/* Tab list */}
      <TabList
        allTabs={allTabs}
        previewTabId={previewTabId}
        originalTab={originalTab}
        onTabHover={handleTabHover}
        onTabHoverEnd={handleTabHoverEnd}
        onTabClick={handleTabClick}
        onCloseTab={handleCloseTab}
      />
    </div>
  );
}

export default App;
