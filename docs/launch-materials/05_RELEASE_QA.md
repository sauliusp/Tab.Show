# TabShow 2.0 local release QA

Verified on 2026-07-22.

## Extension

- `npm test`: 7 files, 36 tests passed.
- `npm run compile`: passed.
- `npm run zip`: passed with WXT 0.20.27.
- Production contents: 575,586 uncompressed bytes across 14 files and six directory entries.
- Release ZIP: `.output/tabshow-2.0.0-chrome.zip`, 185,905 bytes (185.91 kB as reported by WXT).
- SHA-256: `5159f4fa1b69a074854a2b75f9b2d939eeb9dc3a74bd299104ac4fd7ba77b002`.
- Manifest: MV3, version 2.0.0, correct title and 106-character summary.
- Permissions: `sidePanel`, `tabs`, `tabGroups`, `favicon`; no `host_permissions`; no `activeTab`.
- Required 16/32/48/96/128 icons present.
- No source maps or source files in the ZIP.

Known non-blocking warning: the minified side-panel JavaScript chunk is 530,904 bytes (530.90 kB as reported by WXT) and exceeds Vite's 500 kB warning threshold. This is a maintainability/performance follow-up and a reason not to publish unmeasured “ultralight” or “zero impact” claims.

## Store and website assets

- Five screenshots: exact 1280×800 RGB PNG, no alpha.
- Small tile: exact 440×280 RGB PNG, no alpha.
- Marquee tile: exact 1400×560 RGB PNG, no alpha.
- Social card: exact 1200×630 RGB PNG, no alpha.
- Authentic UI source captures: `marketing/source/appshots/`.
- ImageGen editorial sources: `marketing/source/imagegen/editorial/`.
- Deterministic compositor: `marketing/finalize_imagegen_assets.py`.
- Final prompt ledger: `marketing/IMAGEGEN_PROMPTS.md`.
- Desktop and mobile website QA captures: `marketing/qa/`.
- Authentic appshots and every derived listing/website campaign image were regenerated after the final keyboard-navigation changes. The keyboard frame now shows selection without triggering a preview; hover remains the explicit live-preview interaction.

## Website

- `npm run lint`: passed.
- `npm test`: production build passed; 6 rendered-output test groups passed, including the complete release-history assertion.
- Nine routes included in the build.
- Unique titles and canonicals verified.
- Honest competitor positioning, privacy language, support limitations, sitemap, and robots verified.
- Desktop and 390-pixel mobile layouts visually inspected; privacy page has no horizontal overflow.

## Dependency and build notes

The current Node runtime is 23.7.0 while one website lint dependency declares support for Node 20.19+, 22.13+, or 24+. The build and tests pass, but production should use the website's declared Node `>=22.13.0`, preferably an even-numbered LTS release.

`npm install --package-lock-only` reports transitive dependency advisories in both projects. No automatic breaking `audit fix` was applied during launch preparation. Review and update dependencies in a separate maintenance change so release behavior is not silently altered.
