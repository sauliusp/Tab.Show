# TabShow 2.4.0 release candidate

Updated on 15 November 2026. Status: release candidate implemented; core native Chrome checks have passed, with final keyboard, long-list, locale, asset, packaging, and review checks still pending. This file does not confirm a Chrome Web Store submission or public release.

This release addresses repeated panel closure, losing the current tab in a long list, and settings that did not stay saved. It also adds German, Simplified Chinese, and Traditional Chinese alongside English, and explains existing features more clearly. See [feedback-plan.md](feedback-plan.md) and [localization-plan.md](localization-plan.md) for the scope and market rationale.

## Release scope

- Add **Keep panel open after choosing a tab**. It is off by default. When enabled, choosing a tab keeps the panel open. A choice in the current window becomes the starting point for subsequent previews; choosing another window preserves the original window's return tab.
- Add **Preview tabs on hover**. It is on by default. Users can turn it off while retaining search, keyboard selection, and click-to-switch.
- Save the selected sort order.
- Reveal the current tab when the panel opens and keep list position stable during normal use.
- Keep tab membership accurate when tabs move between windows.
- Show the installed version and help/release-note links in Settings.
- Clarify that System appearance follows light/dark preference, while custom Chrome theme colors stay separate.
- Update welcome and release pages with exact setting names and practical instructions. Use a current product capture on the welcome page.
- Open feature-release notes in an inactive tab; do not open them automatically for patch updates. Keep the notes accessible from Settings.
- Follow Chrome's display language for the panel, Settings, accessibility text, share messages, onboarding, and release notes. Keep English fallback and local message catalogs; no translation service is required.

The release is intended to retain the existing permission set and keep tab data in the browser. Verify both against the final ZIP before submission. The existing close-on-selection and hover-preview defaults are preserved.

## Growth baseline and outcome

The authenticated dashboard baseline and country/language exports are retained outside the public repository. Compare the same metric definitions and reporting windows after release. Country and browser-language totals describe different populations and must not be combined into a conversion rate. The localization priorities address existing non-English users as part of the overall market evaluation.

Success means sustained user growth with stable retention. Compare the same report definitions after release and investigate new uninstall or bug-report signals. The report alone cannot establish what caused a change. See the feedback plan for seven-day regression and 30-day outcome checks. No extension telemetry is required for this initial comparison.

## Required validation before submission

- Automated extension tests and TypeScript check pass.
- Production ZIP builds; manifest version, permissions, contents, and digest are recorded.
- Existing settings survive upgrading from 2.3; both new preferences have the stated defaults.
- Pointer preview, return, click/Enter selection, and Escape work with the panel kept open and with the default behavior.
- Turning previews off cancels any pending preview and keeps search/navigation usable.
- Current-tab reveal works in a long list; searching, sorting, scrolling, and collapsed groups do not cause unexpected jumps.
- Tabs moved between windows are reflected in Current window and All windows views.
- Install/update pages, local assets, actions, shortcuts, external links, and responsive layouts are checked in real Chrome. Feature-update notes open inactive; patch updates do not open them automatically.
- German, Simplified Chinese, and Traditional Chinese work in native Chrome, including input-method composition and small panel widths. Enter used to confirm composing text must not choose a tab.
- The Codex review loop is complete and the reviewed release is merged to main before submission.
- Store description and screenshots reflect the packaged behavior. Any retained video is checked against it.
- Website copy and changelog agree with the release status and product behavior.

## Validation record

The native checks below were performed on 15 November in normal Google Chrome using the dedicated TabShow QA profile and uncluttered sample pages. They replace the earlier locked-Mac blocker. Harness renders remain separate evidence.

| Check | Observed result |
|---|---|
| Upgrade from 2.3 using the same extension ID and path | Dark appearance, Ink color pairing, 350 ms hover delay, and All windows preference survived |
| New preference defaults after upgrade | Keep-open off; hover preview on |
| Feature-update notes | Opened in an inactive tab |
| Default pointer preview and return | Passed |
| Default click and keyboard Enter selection | Selected the requested tab and closed the panel |
| Keep-open selection | Selected the tab and retained the panel |
| Escape while Search is focused | Restored the committed tab and closed the panel |
| Escape while the document/body is focused | Gap found and fixed; native retest of the new fallback is pending |
| Hover previews disabled | Hover did not activate tabs; clicking still selected a tab |
| Persistent cross-window selection | Original window returned to its committed tab; target window switched correctly |
| Tab moved between windows | Window grouping and current-window count updated correctly |
| Saved sorting | Preserved after closing and reopening the panel |
| Welcome/update Open TabShow buttons | Opened the actual extension panel |
| Long-list behavior, input-method composition, and all three new native locales | Pending |

- Automated checks: the most recent recorded full run passed 157 tests. Eight image-contract tests were added afterward; that full-run count does not include them. TypeScript and the production build passed. Run the full suite again against the final release head.
- Localization: complete catalogs and placeholder contracts are tested, including English fallback, localized numbers, Chinese plural handling, preserved inline keyboard cues, and text-only page rendering. These checks do not replace native locale and IME verification.
- Packaging: the previous ZIP predates the current localization and keyboard changes and is obsolete. **No final release ZIP or digest is recorded yet.** Rebuild `.output/tabshow-2.4.0-chrome.zip` after the source is frozen; inspect version, locale contents, permissions, integrity, and digest. The manifest source still lists only `sidePanel`, `tabs`, and `tabGroups`, with no host permissions. Confirm this in the final ZIP. Include the locale-sync build script in the sources archive.
- Layout: earlier English production-component renders were inspected at 320 and 360 pixel widths, with welcome/update pages checked at desktop and mobile sizes. Final localized layouts require another review, especially long German labels and narrow Settings/footer controls.
- Website: earlier build and content checks passed. The first gallery PNG now exists in the repository website at 1280 × 800. It was still absent from the authoritative Sites checkout when this record was updated. Synchronize the final image, rerun website checks, and inspect the complete gallery before deployment.
- Media: a native English capture and a 1280 × 800 first gallery slide now exist. The gallery clips the bottom of the real capture through CSS; it does not replace or generate the interface. Final capture/asset review against the updated package is pending. The other four slides and two promotional tiles were inspected earlier and also need the final consistency pass. See [asset provenance](../../../marketing/source/appshots-2.4/README.md) and [Store asset status](../../../marketing/output/chrome-web-store-2.4/README.md).
- Existing video: the 31.53-second local demo decodes, and its verified public URL showed the matching default preview/search/keyboard workflow. It does not demonstrate the new optional controls or localized interface. Retain it only with that scope; do not label it a complete 2.4 walkthrough.
- Codex review: [PR 16](https://github.com/sauliusp/Tab.Show/pull/16), branch `codex/2.4.0-panel-workflow`. The review of core commit `315c1b0` was clean. Subsequent localization and keyboard changes require review of the new head and resolution of any findings before merge. An earlier clean review does not approve the current working tree.

Complete the remaining native checks in [NATIVE-QA.md](NATIVE-QA.md), final assets, exact-package validation, and the final-head review before merging and submitting.

## Publication record

| Surface | Status at preparation |
|---|---|
| Extension code | Core behavior verified in normal Chrome; final native locale/keyboard/long-list checks and new-head review pending |
| Chrome ZIP | Previous artifact obsolete; final ZIP and digest pending; not submitted |
| Install/update pages | Native Open TabShow and upgrade-note behavior passed; localized native review pending |
| Store images/video | First native English capture and all five gallery files exist; final updated capture/locale consistency review pending |
| Website | Source prepared; first gallery image exists in repository but still needs authoritative checkout synchronization and final validation; not deployed |
| Chrome Web Store submission | Not submitted |
| Public availability | Store still offers 2.3.0 |
| Featurebase replies/status changes | Five replies posted and verified; keep-open and scroll requests In Progress; search/colors Completed; thumbnails In Review |

A saved Store draft, uploaded ZIP, submitted review, approved review, and publicly available release are different states. Record the observed state without treating one as the next.
