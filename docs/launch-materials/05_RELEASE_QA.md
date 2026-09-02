# TabShow 2.1 local release QA

Verified on 2026-09-02.

## Extension

- `npm test -- --run`: 14 files, 55 tests passed.
- `npm run compile`: passed.
- `npm run build`: passed with WXT 0.20.27.
- `npm run zip`: passed with WXT 0.20.27.
- Production contents: 619,559 uncompressed bytes across 20 archive entries.
- Release ZIP: `.output/tabshow-2.1.0-chrome.zip`, 198,108 bytes.
- SHA-256: `612deee5a181cc94dd29aa048dee6d5219cf862287ab6bf12504214e19f688e8`.
- Manifest: MV3, version 2.1.0, correct title and summary.
- Permissions: `sidePanel`, `tabs`, `tabGroups`; no `host_permissions`; no `activeTab`; no new permission warning.
- Required 16/32/48/96/128 icons present.
- Archive integrity check passed with no corrupt entries.

The minified side-panel JavaScript chunk is 574,200 bytes and exceeds Vite's 500 kB warning threshold. This is a non-blocking maintainability and performance follow-up. Do not publish unmeasured "ultralight" or "zero impact" claims.

## Product regression coverage

- Search remains responsive with 150 tabs and preserves the real open-tab count while filtering.
- ArrowUp, ArrowDown, Enter, Escape, empty results, IME composition, and sort-control focus are covered.
- Delayed hover preview cancellation and 1,000 ms preview timing are covered.
- Current-window and all-window scope, explicit cross-window switching, and stable original-tab restoration are covered.
- Cross-window tab detach and attach events refresh the Tab Chaos Score.
- Chaos history retains the all-time best beyond the 90-check-in rolling observation window.
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

- Earlier live Chrome testing on this branch covered 150 tabs across two windows, stable counts, severity colors, and light and dark appearance modes.
- A final live Chrome pass for the review fixes and the new raw 2.1 screenshot capture remains required before release sign-off.

## Dependency and build notes

The current Node runtime is 23.7.0 while one website lint dependency declares support for Node 20.19+, 22.13+, or 24+. The build and tests pass, but production should use the website's declared Node `>=22.13.0`, preferably an even-numbered LTS release.

`npm install --package-lock-only` previously reported transitive dependency advisories in both projects. No automatic breaking `audit fix` was applied during release preparation. Review and update dependencies in a separate maintenance change so release behavior is not silently altered.
