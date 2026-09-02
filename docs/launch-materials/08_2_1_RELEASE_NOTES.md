# TabShow 2.1 release notes

Target extension version: `2.1.0`

## Short update summary

TabShow 2.1 adds a local-only Tab Chaos Score, dark and light appearance controls, and quicker ways to share feedback or recommend TabShow. It also makes the panel clearer by preserving real open-tab totals during search and separating the Chaos Score from the tab count.

## What's new

- A compact, color-coded Tab Chaos Score based on open tabs, windows, duplicates, tab age, domains, and Chrome groups.
- Local trend history so returning users can see whether their tab session is becoming calmer or busier.
- Dark, light, and system appearance modes.
- Theme-aware selected and preview colors that remain visible in dark mode.
- Suggest a feature and Tell a friend actions directly in the tab panel.
- Paste-ready Chrome Web Store sharing with visible copied confirmation.

## What's improved

- Open-tab and window totals stay unchanged while search narrows the visible results.
- The Chaos Score and open-tab count have separate labels and visual treatments.
- Search, scope, Settings, and Chaos controls use a consistent 40-pixel layout.
- The Chaos button uses its entire surface for the current severity color.
- The current-window preview banner no longer consumes list space.
- Tabs in other windows still have explicit switch-to-window separators.
- Search focus, Arrow key selection, Enter, Escape, and preview-delay behavior have broader regression coverage.

## Privacy

The Chaos Score and its history are calculated and stored locally. TabShow does not send tab titles, URLs, statistics, settings, or Chaos history to a server. Version 2.1 adds no new Chrome permissions.

## Chrome Web Store release note

TabShow 2.1 adds a local-only Tab Chaos Score, dark, light, and system themes, panel shortcuts for feedback and sharing, clearer tab totals, and a more compact interface. Search now keeps the real open-tab count visible while filtering results. No new permissions.

## Release verification

Complete this section from the final release commit after all review findings are resolved:

- Extension tests: pending final review loop.
- TypeScript compilation: pending final review loop.
- Production Chrome MV3 build and manifest inspection: pending final review loop.
- Website production build and rendered-page tests: pending final review loop.
- Chrome side-panel regression QA: pending final review loop.
- Final commit and pull request: pending final review loop.
