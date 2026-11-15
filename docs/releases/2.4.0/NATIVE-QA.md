# Native Chrome validation

Updated 15 November 2026. The core native gates are complete for the final audited production output in [package-audit.md](package-audit.md). Testing used normal Google Chrome, the dedicated TabShow QA profile, sample pages, and the same stable unpacked extension path. Earlier candidate checks and the final-package confirmation are distinguished below. This record establishes native validation within the stated scope, not Chrome Web Store submission or approval.

Test environment: Google Chrome 157.0.8103.52 (official arm64 build), macOS 27.2 (26B123).

## Recorded passes

- The 2.3 to 2.4 upgrade preserved Dark appearance, Ink color pairing, 350 ms hover delay, and All windows. Keep-open defaulted off and hover preview on. The feature-update notes opened in an inactive tab.
- Default hover preview and pointer-leave return worked. Clicking or pressing Enter selected the requested tab and closed the panel.
- Keep-open selection retained the panel. Escape with Search focused restored the committed tab and closed the panel. Escape from a body-focused panel also closed it when no preview was active; the observed focus constraint after a hover preview is documented below.
- With hover previews off, hovering did not activate tabs and clicking still worked. Turning previews off during an active Reading preview restored the committed Project tab while Settings stayed open.
- Cross-window selection restored the original window's committed tab and selected the target in the other window.
- Moving a tab between windows updated its section and the current-window count.
- The selected sort order survived closing and reopening the panel. After the sort-keyboard guard fix, Down then Enter in the open menu changed only the sort order, preserved Project as the active tab, and returned focus to Sort. Escape dismissed only the sort menu. Three fresh menu interactions produced no Errors button in Chrome's Extensions view; the earlier retained `aria-hidden` warning did not recur, and no MUI focus workaround was added.
- In a native 34-tab window, opening the panel revealed the current Sample 30 tab near the bottom. Scrolling manually to the top survived reloading the current page.
- Simplified Chinese `项目` and Traditional Chinese `專案` searches matched tab titles. Down changed the highlighted result without activating a tab; Enter selected it. Search also found Sample 02 inside a collapsed native Chrome group, and Enter expanded the group and selected the tab. Real IME composition was subsequently verified separately below.
- Open TabShow worked from the actual English welcome and update pages.

Supporting earlier captures are in `qa/native-2.3-preferences.jpg`, `qa/native-2.4-migrated-preferences.jpg`, `qa/native-upgrade-inactive-notes.jpg`, `qa/native-default-preview.jpg`, and `qa/native-default-selected.jpg`. The remaining entries above record observed interactions; those five images are not evidence for every step.

## Final production-package confirmation

The audited production output identified by SHA-256 `6407ce9ecf8ef0dd73a24f45a7e895572d3f002346b9c5f02b4459fd9fd88fb7` was copied to the stable QA extension directory. Native Reload confirmed version 2.4.0. This was the retained production build, not the removed focus trial or QA diagnostic build.

- In the sort menu, Down then Enter changed the order to Recently used without activating a browser tab and returned focus to Sort. Current order was then restored.
- Searching Research and pressing Enter selected Research while keeping the panel open.
- The English Tell a friend button changed to Copied and displayed “Chrome extension link copied” with “Paste it into any message, email, or post.” This confirms the observed success feedback; the localized variants of this interaction are outside the recorded native coverage.
- Settings displayed About TabShow 2.4.0.
- After turning Keep panel open off, searching Reading and pressing Enter selected Reading and closed the panel.
- After committing Project, the native drag-based hover simulation previewed Reading. Clicking Search and pressing Escape restored Project and closed the panel.
- A QA-only manifest version change from 2.4.0 to 2.4.1 followed by native Reload showed version 2.4.1, retained the same six tabs, and opened no release-notes tab. This tests an actual version change, rather than relying on an unchanged-version reload. [Patch-update capture](qa/native-patch-no-notes.jpg).
- The exact production 2.4.0 manifest was then restored. Native Reload confirmed 2.4.0 again with no added tabs. The two disposable IME fixtures and the Extensions tab were closed after testing. The production source and archive were not changed by the QA-only version test.

## Native localization evidence and limits

German, Simplified Chinese and Traditional Chinese were exercised in normal Chrome through isolated QA-only fallback packages. Each package retained one locale catalog, removed the other catalogs, and set `default_locale` to that locale. These variants did not change the production package or the operating system's display language.

- Panel labels, Settings, accessibility names, counts and help appeared translated in all three variants.
- The native welcome-page Open TabShow action passed in all three variants.
- The localized release pages were read and captured in all three variants.

This verifies Chrome's native catalog fallback and translated rendering. It does **not** verify automatic selection through an actual OS/Chrome display-language change. No full OS display-language change is planned for this release. Native zoom coverage is also not established by these checks. These are recorded scope limits, not mandatory pending gates; the real Chinese IME tests below are separate evidence.

## Real Chinese IME passes

Both Traditional and Simplified Chinese Pinyin inputs were tested using physical key presses in normal Chrome. Input switching with Control + Option + Space worked. Typing `xiangmu` produced the underlined `xiang mu` preedit while two matching fixture tabs were present.

- **Traditional Pinyin:** Down during composition left result A selected and Project active. The first Return committed the ASCII preedit without activating a tab. A subsequent Space-confirmed composition produced `項目`; after composition ended, Down highlighted result B and Return activated B while keeping the panel open.
- **Simplified Pinyin:** Down during composition left result A selected and tab B active. The first Return confirmed `项目` without activating a tab. A second Return then activated result A.

Captures: [Traditional preedit](qa/native-ime-traditional-preedit.jpg), [Traditional selection](qa/native-ime-traditional-selection.jpg), [Simplified preedit](qa/native-ime-simplified-preedit.jpg), and [Simplified selection](qa/native-ime-simplified-selection.jpg).

Both temporary Pinyin inputs were removed after testing. The input-source list was verified to contain only the original ABC and Lithuanian–QWERTY entries.

## Observed Chrome focus constraint

After a body-focused panel activated a hover preview, keyboard focus moved into the page and Escape no longer reached the panel. Synchronous panel-root focus, element-only restoration, and guarded `window.focus()` restoration did not retain keyboard focus in the native drag-based pointer simulation. Native diagnostics showed Chrome refusing the attempted window refocus in this setup. The focus-restoration trial and its diagnostics were removed; they are not part of the retained release candidate.

Reliable return actions were verified: move the pointer outside the panel to restore the committed tab, or click Search and then press Escape to restore the committed tab and close the panel. Escape works while the panel has keyboard focus; do not claim it is a browser-wide key after Chrome transfers focus to the page. This observed Chrome constraint is documented rather than represented as a successful refocus fix.

## Other validation evidence

- The retained production source passed all 167 extension tests, TypeScript, the production build and ZIP generation. All four catalogs contain 341 messages. The German 280-pixel overflow fix passed visual review. The abandoned focus trial and its diagnostics are absent; its larger test count is not used as final-release evidence. See [package-audit.md](package-audit.md) for the final artifact identity and package checks.
- All 20 gallery images across the four languages and both promotional tiles passed visual review. The first gallery image was recaptured and the matching website PNG restored. This supersedes the earlier missing/incomplete-image blocker. The composed gallery uses the real source capture with CSS cropping; it does not synthesize product UI.
- The website's 10 tests and lint passed. The authoritative Sites helper rebuilt the React 19.2.9 source at `63551ca82218232538bc4c141966e80fc24a57be`. No Sites version was saved or deployed.

## Recorded scope limits

- Native localized clipboard/share feedback and individual external-help/shortcut link paths were not all exercised. Catalog completeness, translated help rendering, and the native welcome actions are separate recorded checks; they are not blanket proof of every localized interaction.
- The OS/Chrome display language was not changed. The three native localized variants establish catalog fallback/rendering, not display-language selection. Real Pinyin composition was tested separately and passed.
- Native zoom combinations were not exercised. The recorded narrow-layout evidence includes the German 280-pixel visual check.
- Turning previews off during an active preview passed. The short pending-delay disable/re-enable combination was not exercised natively; its automated coverage is not described as a native pass.
- Pointer preview testing included native drag-based pointer simulation. The documented Chrome keyboard-focus constraint remains: after focus transfers to the page, use pointer leave or click Search then Escape. No unconditional browser-wide Escape behavior is claimed.

These are the limits of the completed validation scope, not additional mandatory release gates. They must remain visible in the record rather than be converted into unqualified passes.

## Release handoff

Core native gates and the final production-package confirmation above are complete. Use [package-audit.md](package-audit.md) for the exact artifact and the [release README](README.md) for code-review, merge, upload and publication status. Any later extension source or asset change requires the appropriate package verification; this record does not approve a different artifact.

Store upload/submission, review approval, and public availability are different states and are not established by this native QA record. Record each observed state after the corresponding action, and publish the matching Sites version through its release workflow.
