# TabShow 2.1 local release QA

Verified on 2026-09-02.

## Extension

- `npm test -- --run`: 14 files, 58 tests passed.
- `npm run compile`: passed.
- `npm run build`: passed with WXT 0.20.27.
- `npm run zip`: passed with WXT 0.20.27.
- Production contents: 620,027 uncompressed bytes across 20 archive entries.
- Release ZIP: `.output/tabshow-2.1.0-chrome.zip`, 198,249 bytes.
- SHA-256: `ad0f18c2c4ef583d466b716b866edeaad3628040eebf4dd0ce28139e7b08e9fe`.
- Manifest: MV3, version 2.1.0, correct title and summary.
- Permissions: `sidePanel`, `tabs`, `tabGroups`; no `host_permissions`; no `activeTab`; no new permission warning.
- Required 16/32/48/96/128 icons present.
- Archive integrity check passed with no corrupt entries.

The minified side-panel JavaScript chunk is 574,670 bytes and exceeds Vite's 500 kB warning threshold. This is a non-blocking maintainability and performance follow-up. Do not publish unmeasured "ultralight" or "zero impact" claims.

## Product regression coverage

- Search remains responsive with 150 tabs and preserves the real open-tab count while filtering.
- ArrowUp, ArrowDown, Enter, Escape, empty results, IME composition, and sort-control focus are covered.
- Delayed hover preview cancellation and 1,000 ms preview timing are covered.
- Current-window and all-window scope, explicit cross-window switching, and stable original-tab restoration are covered.
- Cross-window tab detach and attach events refresh the Tab Chaos Score.
- Overlapping Chaos refreshes cannot roll newer tab statistics back to stale values.
- Chaos history retains the all-time best beyond the 90-day rolling observation window and coalesces repeated same-day openings so streaks remain accurate.
- Chrome internal pages are grouped under clear `Chrome` and `Chrome extension` labels rather than internal component names.
- Chaos overlay focus, Escape close, focus restoration, and severity-color text contrast are covered.
- Dark, light, and system appearance persistence plus theme-aware selected and preview colors are covered.
- Suggest a feature and Tell a friend panel actions are covered, including clipboard confirmation.

## Website

- `npm run lint`: passed.
- `npm test`: production build passed; 6 rendered-output test groups passed.
- Nine routes included in the build.
- Unique titles and canonicals verified.
- The privacy page discloses the 90 local Chaos check-ins, all-time best retention, fields stored, and deletion routes.
- Honest competitor positioning, support limitations, sitemap, and robots verified.

## Chrome and visual QA

- Chrome's extension manager confirms the unpacked `TabShow: Live Tab Preview` build is enabled at version 2.1.0.
- Actual Chrome rendered the current production side-panel components with deterministic local data at 420×800. The seven captured states cover preview, 150-tab search across four windows, keyboard search in dark mode, cross-window boundaries, sorting, settings, and the Chaos drawer.
- The 150-tab search frame keeps `OPEN TABS 150` and `WINDOWS 4` visible while showing only matches.
- The preview frame keeps the current tab violet and the hovered preview tab amber.
- A 320×800 Chrome regression frame verifies that narrow All windows mode keeps both tab and window counts visible without horizontal clipping.
- All seven release-source PNGs are 420×800 RGB images without alpha and have one matching Markdown brief each.

## Dependency and build notes

The current Node runtime is 23.7.0 while one website lint dependency declares support for Node 20.19+, 22.13+, or 24+. The build and tests pass, but production should use the website's declared Node `>=22.13.0`, preferably an even-numbered LTS release.

`npm install --package-lock-only` previously reported transitive dependency advisories in both projects. No automatic breaking `audit fix` was applied during release preparation. Review and update dependencies in a separate maintenance change so release behavior is not silently altered.
