# TabShow 2.4.0 package audit

Audited 15 November 2026 after removing all provisional hover-focus restoration code and retaining the confirmed sort-menu keyboard fix. This is a package-integrity result, not release approval. Final native confirmation of this exact production output is now recorded in [NATIVE-QA.md](NATIVE-QA.md), including the stated scope limits.

## Artifact identity

| Field | Audited value |
| --- | --- |
| Archive | `.output/tabshow-2.4.0-chrome.zip` |
| Version | `2.4.0` |
| Source base at audit | `7f70ce824b6995bb6379e2e98df27b2c2c16a5d9` plus the uncommitted App sort guard and its two regression tests |
| Compressed bytes | 1,014,293 |
| Uncompressed bytes | 1,634,295 |
| Entries | 22 files, no duplicate paths |
| SHA-256 | `6407ce9ecf8ef0dd73a24f45a7e895572d3f002346b9c5f02b4459fd9fd88fb7` |
| Default locale | `en` |
| Packaged locales | `en`, `de`, `zh_CN`, `zh_TW` |

This digest identifies the rebuilt production archive. Earlier candidate ZIP hashes and the separate `.output/chrome-mv3-qa` diagnostic build do not identify this package. Native QA must reload `.output/chrome-mv3` or an exact copy of these audited files.

## Verified checks

- ZIP CRC integrity passes for every entry. No absolute paths, parent traversal, symbolic links, or encrypted entries.
- All 22 extracted files match `.output/chrome-mv3` byte for byte, with no extra production-output files. Every packaged public asset, page, script, icon, and locale catalog also matches its owning file under `public/`.
- Manifest version matches `package.json`. Manifest names, description, action title, and command description use existing message keys. `default_locale` is `en`.
- Permissions remain exactly `sidePanel`, `tabs`, and `tabGroups`. No required or optional host permissions were added.
- Each of the four catalogs contains all 341 nonempty messages with the same named placeholders and positional substitution definitions as the English source fragments. The English catalog matches those fragments exactly, and all manifest message references resolve.
- Only expected production files are present. No tests, fixtures, source maps, repository files, dependencies, or QA directory are packaged.
- The removed focus hook, callback, focus-generation identifier, and `[TabShow preview focus]` diagnostic markers are absent from the packaged JavaScript. The provisional focus-restoration code is also absent from the production source.
- All local HTML and CSS resource references resolve within the archive. Localized welcome-image paths exist for all four languages.
- All nine PNG files have valid signatures, chunk CRCs, zlib image data, expected scanline lengths and filter bytes. Icon dimensions match their names. The four onboarding screenshots are each 420 × 700 px and match the public assets. This encoding check does not replace visual review.
- Hashes of 88 source/configuration/asset files recorded before ZIP generation remained unchanged through the audit.

## Build and automated validation

The retained source passed the full **167-test suite across 24 files**, `npm run compile`, `npm run build`, and `npm run zip`. The sort-menu regressions cover Arrow-key navigation and Enter staying in the sort menu; the existing Escape behavior and tab interaction tests also pass.

The build used Node v22.20.0, npm 10.9.3, WXT 0.21.4 and Vite 7.3.6. Both production build commands completed without errors. Vite reported its existing large-chunk advisory for the 612,469-byte side-panel JavaScript chunk.

This audit verifies the generated ZIP against the current production output and source assets. It does not claim a fresh dependency installation or an independent isolated rebuild of this new artifact. A prior isolated-rebuild result belonged to an earlier candidate and is not carried forward to this digest.

## Package inventory

| Entry | Uncompressed bytes |
| --- | ---: |
| `_locales/de/messages.json` | 51,411 |
| `_locales/en/messages.json` | 49,014 |
| `_locales/zh_CN/messages.json` | 49,950 |
| `_locales/zh_TW/messages.json` | 49,820 |
| `assets/sidepanel-ZqAqKmcg.css` | 4,280 |
| `background.js` | 1,265 |
| `chunks/sidepanel-Cc8CwjEH.js` | 612,469 |
| `icon/128.png` | 1,500 |
| `icon/16.png` | 393 |
| `icon/32.png` | 568 |
| `icon/48.png` | 863 |
| `icon/96.png` | 1,454 |
| `manifest.json` | 645 |
| `pages/assets/tabshow-panel-2.4-de.png` | 200,200 |
| `pages/assets/tabshow-panel-2.4-zh_CN.png` | 187,637 |
| `pages/assets/tabshow-panel-2.4-zh_TW.png` | 185,616 |
| `pages/assets/tabshow-panel-2.4.png` | 194,430 |
| `pages/onboarding.js` | 4,645 |
| `pages/shared.css` | 18,141 |
| `pages/welcome/index.html` | 10,089 |
| `pages/whats-new/index.html` | 9,498 |
| `sidepanel.html` | 407 |

## Native focus limitation and release gates

Native diagnostic tests established that the guarded focus requests ran after hover activation, but Chrome still reported the panel document as unfocused. The ineffective trials and their tests were removed. No repeated focus attempts, forced panel reopening, or extra page permissions are included.

Escape is handled when the panel has keyboard focus, including its document/body. Once Chrome gives keyboard focus to the previewed webpage, the panel cannot receive that webpage's Escape key. Moving the pointer out of the panel remains the pointer return action; clicking Search restores panel keyboard focus. Native QA must distinguish these cases instead of recording an unconditional Escape-after-hover pass.

The exact retained production output was copied into the stable QA directory and reloaded in normal Chrome, which confirmed version 2.4.0. Final native checks passed for sort-menu keyboard isolation/focus return, search-and-Enter selection with keep-open enabled, and Project → Reading preview → click Search → Escape returning to Project and closing the panel.

A QA-only manifest bump to 2.4.1 was confirmed by native Reload without opening release notes or changing the six-tab count. Restoring the exact production 2.4.0 manifest and reloading added no tabs. This test did not modify the audited production archive. Core native gates are complete within [NATIVE-QA.md](NATIVE-QA.md)'s scope; unexercised localized share feedback, real display-language selection, zoom combinations and the short pending-delay toggle are recorded limits, not claimed passes.

This audit preserves the artifact evidence from before submission. The same ZIP was submitted on 15 November 2026 and is pending Google review; final Codex review and PR 16 merge are complete. See the [release README](README.md#publication-record) for the dated publication record. Any later extension production-source or packaged asset change invalidates this artifact identity and requires a new ZIP and audit.
