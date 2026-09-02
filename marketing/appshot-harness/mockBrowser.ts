type Listener = (...args: unknown[]) => void;

const event = () => {
  const listeners = new Set<Listener>();
  return {
    addListener(listener: Listener) { listeners.add(listener); },
    removeListener(listener: Listener) { listeners.delete(listener); },
  };
};

function favicon(letter: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${background}"/><text x="16" y="21" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${foreground}">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const now = Date.now();

const baseTabs = [
  { id: 101, windowId: 10, index: 0, active: true, pinned: true, groupId: -1, title: 'Q3 launch plan: Google Docs', url: 'https://docs.google.com/document/d/tabshow-launch-plan', favIconUrl: favicon('D', '#4285f4'), lastAccessed: now },
  { id: 102, windowId: 10, index: 1, active: false, groupId: 31, title: 'TabShow 2.0: product design', url: 'https://www.figma.com/design/tabshow-2', favIconUrl: favicon('F', '#a259ff'), lastAccessed: now - 15_000 },
  { id: 103, windowId: 10, index: 2, active: false, groupId: 31, title: 'TabShow launch campaign', url: 'https://www.notion.so/tabshow-launch', favIconUrl: favicon('N', '#191919'), lastAccessed: now - 32_000 },
  { id: 104, windowId: 10, index: 3, active: false, groupId: 31, title: 'Website hero: final review', url: 'https://www.figma.com/design/tabshow-website', favIconUrl: favicon('F', '#f24e1e'), lastAccessed: now - 45_000 },
  { id: 105, windowId: 10, index: 4, active: false, groupId: 32, title: 'Chrome Web Store dashboard', url: 'https://chrome.google.com/webstore/devconsole', favIconUrl: favicon('C', '#34a853'), lastAccessed: now - 85_000 },
  { id: 106, windowId: 10, index: 5, active: false, groupId: 32, title: 'TabShow feedback & feature requests', url: 'https://narsheek.featurebase.app/', favIconUrl: favicon('T', '#ff9f43', '#29233f'), lastAccessed: now - 120_000 },
  { id: 107, windowId: 10, index: 6, active: false, groupId: -1, title: 'Inbox: launch partners', url: 'https://mail.google.com/mail/u/0/#inbox', favIconUrl: favicon('M', '#ea4335'), lastAccessed: now - 170_000, audible: true },
  { id: 108, windowId: 10, index: 7, active: false, groupId: -1, title: 'TabShow analytics', url: 'https://analytics.google.com/analytics/web/', favIconUrl: favicon('A', '#f9ab00', '#29233f'), lastAccessed: now - 260_000, discarded: true },
  { id: 201, windowId: 20, index: 0, active: true, pinned: true, groupId: -1, title: 'Linear: TabShow launch', url: 'https://linear.app/tabshow/team/launch', favIconUrl: favicon('L', '#5e6ad2'), lastAccessed: now - 20_000 },
  { id: 202, windowId: 20, index: 1, active: false, groupId: 41, title: 'TabShow website copy', url: 'https://docs.google.com/document/d/tabshow-website-copy', favIconUrl: favicon('D', '#4285f4'), lastAccessed: now - 70_000 },
  { id: 203, windowId: 20, index: 2, active: false, groupId: 41, title: 'Launch metrics dashboard', url: 'https://lookerstudio.google.com/reporting/tabshow', favIconUrl: favicon('L', '#0f9d58'), lastAccessed: now - 145_000 },
  { id: 204, windowId: 20, index: 3, active: false, groupId: -1, title: 'Product Hunt launch checklist', url: 'https://www.producthunt.com/posts/tabshow', favIconUrl: favicon('P', '#ff6154'), lastAccessed: now - 220_000 },
];

const groups = [
  { id: 31, title: 'TabShow design', color: 'purple', collapsed: false, windowId: 10 },
  { id: 32, title: 'Launch', color: 'orange', collapsed: false, windowId: 10 },
  { id: 41, title: 'Website', color: 'blue', collapsed: false, windowId: 20 },
];

let activeTabId = 101;

function buildTabs(requestedCount: number) {
  if (requestedCount <= baseTabs.length) return baseTabs.slice(0, requestedCount);
  const generated = Array.from({ length: requestedCount - baseTabs.length }, (_, offset) => {
    const index = offset + baseTabs.length;
    const duplicate = index % 23 === 0;
    const windowId = [10, 20, 30, 40][index % 4];
    const existingWindowTabs = baseTabs.filter(tab => tab.windowId === windowId).length;
    return {
      id: 300 + index,
      windowId,
      index: existingWindowTabs + Math.floor(offset / 4),
      active: false,
      groupId: -1,
      title: `High-volume QA tab ${String(index + 1).padStart(3, '0')}`,
      url: duplicate ? 'https://qa.example/repeated-dashboard' : `https://site${index % 20}.example/item/${index}`,
      favIconUrl: favicon(String((index % 9) + 1), ['#4285f4', '#a259ff', '#34a853', '#ff6b6b'][index % 4]),
      lastAccessed: now - (index % 12) * 24 * 60 * 60 * 1000,
      discarded: index % 31 === 0,
      audible: index % 47 === 0,
    };
  });
  return [...baseTabs, ...generated];
}

export function createMockBrowser(requestedCount = baseTabs.length) {
  const tabs = buildTabs(Math.max(1, requestedCount));
  const updates: Array<{ id: number; at: number }> = [];
  return {
    qa: { updates },
    tabs: {
      async query(query: { active?: boolean; currentWindow?: boolean } = {}) {
        return tabs.filter(tab => (!query.active || tab.id === activeTabId) && (!query.currentWindow || tab.windowId === 10));
      },
      async get(id: number) { return tabs.find(tab => tab.id === id); },
      async update(id: number, changes: { active?: boolean }) {
        if (changes.active) {
          activeTabId = id;
          const at = performance.now();
          updates.push({ id, at });
          document.documentElement.dataset.qaLastUpdateId = String(id);
          document.documentElement.dataset.qaLastUpdateAt = String(at);
        }
        return tabs.find(tab => tab.id === id);
      },
      async remove() {},
      onRemoved: event(), onUpdated: event(), onCreated: event(), onMoved: event(), onReplaced: event(), onActivated: event(),
    },
    windows: {
      async getCurrent() { return { id: 10 }; },
      async update() { return {}; },
      onFocusChanged: event(),
    },
    tabGroups: {
      async query(query: { windowId?: number } = {}) { return groups.filter(group => query.windowId === undefined || group.windowId === query.windowId); },
      async update() {},
      onCreated: event(), onUpdated: event(), onRemoved: event(),
    },
    sidePanel: { async close() {} },
    runtime: {
      getURL(path: string) { return path.startsWith('data:') ? path : `http://127.0.0.1:4174/${path.replace(/^\//, '')}`; },
      getManifest() { return { version: '2.0.0' }; },
    },
  };
}
