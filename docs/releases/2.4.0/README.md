# TabShow 2.4.0 release candidate

Prepared on 14 November 2026. Status: release candidate implemented; native Chrome validation and final assets pending. This file does not confirm a Chrome Web Store submission or public release.

This release addresses repeated panel closure, losing the current tab in a long list, and settings that did not stay saved. It also explains existing features more clearly. The feedback assessment and scope decisions are in [feedback-plan.md](feedback-plan.md).

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

The release is intended to retain the existing permission set and keep tab data in the browser. Verify both against the final ZIP before submission. The existing close-on-selection and hover-preview defaults are preserved.

## Growth baseline and outcome

The live Chrome developer dashboard showed **356 users** on 14 November 2026. This is the baseline observed during the release work, not an estimate or a promised result. The public Store's cached user count can differ.

The authenticated dashboard baseline is retained locally. Compare its same metric definitions and reporting windows after release; the public repository does not include non-public dashboard analytics.

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
- The Codex review loop is complete and the reviewed release is merged to main before submission.
- Store description and screenshots reflect the packaged behavior. Any retained video is checked against it.
- Website copy and changelog agree with the release status and product behavior.

## Validation record

- Extension: 126 tests across 21 files passed, including migration, real virtualized-list geometry, background install/update behavior, hover cancellation, rapid selections, cross-window restoration, and settings keyboard behavior. TypeScript and diff checks passed.
- Packaging caught a WXT entrypoint collision that tests did not catch. Moving the background integration test to `src/test` fixed it; the 13 relevant tests and TypeScript passed again.
- Candidate ZIP: `.output/tabshow-2.4.0-chrome.zip`, 397,018 bytes, 15 entries. SHA-256: `237754aaf48cf6182d5bc92d8631aac08fafb74f15806fb72ac8121e4d222e71`. Integrity check passed. Manifest is 2.4.0 with only `sidePanel`, `tabs`, and `tabGroups`; no host permissions or test files. The welcome image is included. Rebuild and record a new digest if packaged source changes.
- Browser layout: current production components rendered in Chrome at 320 and 360 pixel panel widths. Settings toggles, disabled delay, Escape focus behavior, and overflow were checked. Welcome/update pages were inspected at desktop and mobile sizes. These harness checks do not prove extension API behavior.
- Website: build and eight rendered-content tests pass. A ninth asset-integrity test deliberately blocks release while the first gallery image is missing. Mobile Support at 375 × 812 has no horizontal overflow. Final home/gallery visual QA remains pending.
- Media: four gallery slides and both promotional tiles are complete and visually inspected. The first gallery slide needs a native Chrome capture. See `marketing/output/chrome-web-store-2.4/README.md` and source provenance. The existing 31.53-second local demo decodes successfully and shows the unchanged default preview/search/keyboard workflow. Its current public YouTube URL plays the matching 31-second demo; it can remain in the listing.
- Codex review: [PR 16](https://github.com/sauliusp/Tab.Show/pull/16), branch `codex/2.4.0-panel-workflow`. The first review found a superseded-selection race; regression tests reproduced it, commit `71c54d2` fixed it, and the review thread was resolved. The second review of `71c54d2` found no major issues. The later packaging, copy, and asset changes require review of their own head. The PR remains draft and is not merged.
- Native browser verification stopped because the Mac is locked and native input is unavailable. Chrome for Testing 153 has the candidate loaded, but real pointer preview, persistence, installation/update actions, and multi-window checks remain unverified. The user has been asked to unlock manually.

Passing component tests is not a substitute for real Chrome validation. Do not merge, submit the Store package, or deploy the website until the remaining checks and first image are complete.

## Publication record

| Surface | Status at preparation |
|---|---|
| Extension code | Implemented in draft PR 16; review and native checks pending |
| Chrome ZIP | Candidate built and inspected; digest above; not submitted |
| Install/update pages | Updated and layout checked; native open/install/update actions pending |
| Store images/video | Four gallery slides and two tiles ready; first native capture pending; existing demo retained |
| Website | Source updated in repository and authoritative Sites checkout; not deployed; first image missing |
| Chrome Web Store submission | Not submitted |
| Public availability | Store still offers 2.3.0 |
| Featurebase replies/status changes | Five replies posted and verified; keep-open and scroll requests In Progress; search/colors Completed; thumbnails In Review |

A saved Store draft, uploaded ZIP, submitted review, approved review, and publicly available release are different states. Record the observed state without treating one as the next.
