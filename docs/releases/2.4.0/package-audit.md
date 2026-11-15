# TabShow 2.4.0 package audit

Audited 15 November 2026 against the current release candidate and an isolated production rebuild. This is a package-integrity result, not release approval. Final native Chrome QA is still pending because the Mac relocked; see [NATIVE-QA.md](NATIVE-QA.md).

## Artifact identity

| Field | Audited value |
| --- | --- |
| Archive | `.output/tabshow-2.4.0-chrome.zip` |
| Version | `2.4.0` |
| Source commit at audit | `574a63fa7a6c0c9d8caa2f5b0f5fbd4987d2bbcc` |
| Compressed bytes | 1,014,285 |
| Uncompressed bytes | 1,634,262 |
| Entries | 22 files, no duplicate paths |
| SHA-256 | `b0c6001875a216b174b5d7c5669659b7bfc52c3afdd7c2070dc9d38ae94fd15f` |
| Default locale | `en` |
| Packaged locales | `en`, `de`, `zh_CN`, `zh_TW` |

The archive was read only. Its digest was checked again after validation; it did not change.

## Verified checks

- ZIP CRC integrity passes for every entry. No absolute paths, parent traversal, symbolic links, or encrypted entries.
- All 22 extracted files match `.output/chrome-mv3` byte for byte. Every packaged public asset, page, script, icon, and locale catalog also matches its owning file under `public/`.
- Manifest version matches `package.json`. Manifest names, description, action title, and command description use existing message keys. `default_locale` is `en`.
- Permissions remain exactly `sidePanel`, `tabs`, and `tabGroups`. No host permissions were added.
- Each of the four catalogs contains all 341 nonempty messages with the same named placeholders and positional substitution definitions as the English source fragments. Locale metadata and manifest message references resolve.
- Only expected production files are present. No tests, fixtures, source maps, harnesses, repository files, dependencies, or development tools are packaged. Known test/demo/debug strings are absent from the runtime JavaScript.
- All local HTML and CSS resource references resolve within the archive. Localized welcome-image paths exist for all four languages.
- All nine PNG files have valid signatures, chunk CRCs, zlib image data, expected scanline lengths and filter bytes. Icon dimensions match their names. The four onboarding screenshots are each 420 × 700 px and match the checked-in public assets. This encoding check does not replace visual review.

## Rebuild equivalence

A separate temporary directory received copies of the current production source/configuration, public assets, package manifest and lockfile. It reused the repository's installed dependencies via a `node_modules` symlink. `npm run build` succeeded there using Node 22.20.0, npm 10.9.3, WXT 0.21.4 and Vite 7.3.6.

The rebuilt file set and every extracted file's bytes are identical to this archive's payload, including the generated JavaScript/CSS filenames and contents. No production output or archive in the repository was modified by that rebuild.

This establishes payload reproducibility with the same installed dependency environment. It is not a clean dependency-install test, and no claim is made that a second ZIP would be byte-identical: ZIP metadata and timestamps can differ. The isolated build emitted Vite's large-chunk advisory for the 612,436-byte side-panel JavaScript chunk, with no build errors.

## Package inventory

| Entry | Uncompressed bytes |
| --- | ---: |
| `_locales/de/messages.json` | 51,411 |
| `_locales/en/messages.json` | 49,014 |
| `_locales/zh_CN/messages.json` | 49,950 |
| `_locales/zh_TW/messages.json` | 49,820 |
| `assets/sidepanel-ZqAqKmcg.css` | 4,280 |
| `background.js` | 1,265 |
| `chunks/sidepanel-DX7mQDvn.js` | 612,436 |
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

## Remaining release evidence

The release runner reports the full 165-test suite, TypeScript compilation and ZIP generation passing for this candidate. This audit independently validates the artifact and rebuild; it did not repeat that unchanged full suite.

Final native checks on this exact package remain required, including real Chrome locale selection/fallback, real Chinese IME behavior, final body-focused Escape and long-list flows, and the remaining cases in [NATIVE-QA.md](NATIVE-QA.md). The Mac relocked before those checks were completed. Store upload/submission, review completion, merging, and public availability are not established by this audit. Any later production-source or asset change invalidates this artifact identity and requires a new ZIP and audit.
