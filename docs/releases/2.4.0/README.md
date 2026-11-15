# TabShow 2.4.0 release candidate

Prepared 15 November 2026. The final extension package, native Chrome checks, four localized galleries, and website artifact are ready. Final Codex review, merge, Store submission, and Sites deployment remain pending. Public Store availability is still 2.3.0.

## Release scope

- Optional **Keep panel open after choosing a tab**, off by default. A chosen current-window tab becomes the next preview's return point; cross-window selection preserves the original window's committed tab.
- **Preview tabs on hover**, on by default, with an off switch and the existing configurable delay.
- Saved sorting, current-tab reveal, stable manual scrolling during metadata updates, and correct membership when tabs move between windows.
- A keyboard guard that keeps sort-menu arrows and Enter inside the menu.
- Settings version/help links, clearer pin and System appearance guidance, refreshed welcome and release pages, inactive feature-update notes, and no automatic patch notes.
- English, German, Simplified Chinese, and Traditional Chinese throughout the panel, Settings, accessibility text, share messages, onboarding, and release notes. Native Chrome catalogs select the language, with English fallback.

Permissions remain exactly `sidePanel`, `tabs`, and `tabGroups`, without host permissions, extension telemetry, accounts, or a translation service. Existing close-on-selection and hover-preview defaults are preserved.

See [feedback-plan.md](feedback-plan.md) for the evaluation of Matrazzo's requests and [localization-plan.md](localization-plan.md) for country/language priorities. The authenticated analytics baseline is retained outside the public repository. Country and browser-language totals describe different populations; do not combine them into a conversion rate. Localization addresses existing demand, but growth is not guaranteed. Compare the same Store report definitions after release and investigate uninstall or bug-report changes.

## Validation

- All **167 extension tests**, TypeScript, production build, and ZIP generation passed.
- ZIP SHA-256: `6407ce9ecf8ef0dd73a24f45a7e895572d3f002346b9c5f02b4459fd9fd88fb7`. It contains 22 files and four complete 341-message catalogs. See [package-audit.md](package-audit.md).
- Normal Chrome 157.0.8103.52 on macOS passed the 2.3 upgrade/settings migration, default and keep-open selection, preview/return, hover-off, cross-window selection, moved tabs, saved sorting, 34-tab reveal/manual scrolling, and collapsed-group search checks. Final-package smoke tests repeated sorting, keep-open/default selection, preview, and focused Escape.
- Both native Pinyin input methods passed: composition arrows/Enter did not select tabs; post-composition navigation and Enter worked. Temporary inputs were removed, restoring ABC and Lithuanian–QWERTY.
- An isolated QA version change from 2.4.0 to 2.4.1 produced no new notes tab. The exact production package was restored afterward.
- Native German and Chinese rendering, welcome actions, and release pages passed with QA-only catalog fallback variants. Actual OS display-language switching and native zoom were not exercised. Component layouts include English 320/360 px and German 280 px. Detailed evidence and scope limits are in [NATIVE-QA.md](NATIVE-QA.md).
- All 20 gallery images and both shared promotional tiles passed visual review. Native first slides use actual Chrome captures. The matching website PNG was verified against the approved image. The existing 31.53-second video remains accurate for the default workflow; it does not claim to demonstrate every 2.4 feature or language.
- Website production build, lint, and all **10 tests** passed. Final Sites source is `2224a812c23bf682174ef9a0ae68c0b99d718056`; archive SHA-256 is `36ba5fb84595e03d7e1b0ff98a526a54ea8112e931b3390e0e204140d20c27f8`. React is patched to 19.2.9. See [website-dependency-audit.md](website-dependency-audit.md) for the bounded dependency assessment.

Hover preview can move keyboard focus into the page. Move the pointer out of the panel to return, or click Search to resume panel keyboard commands. Escape returns and closes the panel while it has keyboard focus. The ineffective focus-restoration trial was removed; no forced-focus behavior is shipped.

## Publication record

| Surface | Current state |
|---|---|
| Branch and review | `codex/2.4.0-panel-workflow`, [PR 16](https://github.com/sauliusp/Tab.Show/pull/16); final review pending |
| Chrome ZIP | Audited and natively tested; not submitted |
| Store assets | All four galleries and two shared tiles ready; upload/listing preview pending |
| Website | Final source/archive prepared; not saved or deployed |
| Chrome Web Store submission | Not submitted |
| Public availability | Store still offers 2.3.0 |
| Featurebase | Five replies verified; keep-open/scroll In Progress, search/colors Completed, thumbnails In Review |

A saved draft, uploaded package, submitted review, approved review, and public release are distinct states. Record the state observed. Rebuild and re-audit after any extension source or packaged asset change.
